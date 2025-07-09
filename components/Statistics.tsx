import React from "react";
import { DailyRecord } from "../types";

interface StatisticsProps {
  records: DailyRecord[];
}

export const Statistics: React.FC<StatisticsProps> = ({ records }) => {
  const carRecords = records.filter((record) => record.isCarUsed);
  const totalDistance = carRecords.reduce(
    (sum, record) => sum + (record.distanceTravel || 0),
    0
  );

  const avgExpensePerKm =
    carRecords.length > 0
      ? carRecords.reduce(
          (sum, record) => sum + (record.petrolExpense || 0),
          0
        ) / carRecords.length
      : 0;
  
  const avgMileage =
    carRecords.length > 0
      ? carRecords.reduce((sum, record) => sum + (record.avgKmpl || 0), 0) /
        carRecords.length
      : 0;
      
  const totalExpense = (avgExpensePerKm / avgMileage) * totalDistance;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Monthly Statistics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600">Car Usage Days</div>
          <div className="text-xl font-bold text-blue-800">
            {carRecords.length}
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600">Total Distance</div>
          <div className="text-xl font-bold text-green-800">
            {totalDistance.toFixed(1)} km
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm text-red-600">Total Expense</div>
          <div className="text-xl font-bold text-red-800">
            ₹{totalExpense.toFixed(2)}
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600">Avg Mileage</div>
          <div className="text-xl font-bold text-purple-800">
            {avgMileage.toFixed(1)} km/l
          </div>
        </div>
      </div>
    </div>
  );
};
