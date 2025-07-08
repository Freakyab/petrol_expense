import React, { useState, useEffect } from 'react';
import { DailyRecord } from '../types';

interface ExpenseFormProps {
  selectedDate: string;
  existingRecord?: DailyRecord;
  onSave: (record: DailyRecord) => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  selectedDate,
  existingRecord,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<DailyRecord>>({
    date: selectedDate,
    isCarUsed: false,
    distanceTravel: undefined,
    avgKmpl: undefined,
    petrolExpense: undefined,
    notes: ''
  });

  useEffect(() => {
    if (existingRecord) {
      setFormData(existingRecord);
    }
  }, [existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as DailyRecord);
  };

  const handleInputChange = (field: keyof DailyRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {existingRecord ? 'Edit' : 'Add'} Record - {selectedDate}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Used
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vehicle"
                  checked={formData.isCarUsed === true}
                  onChange={() => handleInputChange('isCarUsed', true)}
                  className="mr-2"
                />
                Car 🚗
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vehicle"
                  checked={formData.isCarUsed === false}
                  onChange={() => handleInputChange('isCarUsed', false)}
                  className="mr-2"
                />
                Scooty 🛵
              </label>
            </div>
          </div>

          {formData.isCarUsed && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance Traveled (km) - Optional
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distanceTravel || ''}
                  onChange={(e) => handleInputChange('distanceTravel', parseFloat(e.target.value) || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter distance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average (km/l) - Optional
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.avgKmpl || ''}
                  onChange={(e) => handleInputChange('avgKmpl', parseFloat(e.target.value) || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter average"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Petrol Expense (₹) - Optional
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.petrolExpense || ''}
                  onChange={(e) => handleInputChange('petrolExpense', parseFloat(e.target.value) || undefined)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter expense"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes - Optional
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Add any notes"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {existingRecord ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};