import React, { useState } from 'react';
import { DailyRecord } from '../types';

interface TransactionListProps {
  records: DailyRecord[];
  onEditRecord: (record: DailyRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  records,
  onEditRecord,
  onDeleteRecord
}) => {
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'expense'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const currentYear = new Date().getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter records by month
  const filteredRecords = records.filter(record => {
    if (filterMonth === 'all') return true;
    const recordDate = new Date(record.date);
    return recordDate.getMonth() + 1 === parseInt(filterMonth);
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const expenseA = a.petrolExpense || 0;
      const expenseB = b.petrolExpense || 0;
      return sortOrder === 'asc' ? expenseA - expenseB : expenseB - expenseA;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSort = (field: 'date' | 'expense') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredRecords.length} entries
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex space-x-3">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Months</option>
            {monthNames.map((month, index) => (
              <option key={index} value={index + 1}>
                {month} {currentYear}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleSort('date')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'date' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('expense')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'expense' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Expense {sortBy === 'expense' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found for the selected filter.
          </div>
        ) : (
          sortedRecords.map((record) => (
            <div
              key={record._id}
              className={`p-3 rounded-lg border-2 transition-all ${
                record.isCarUsed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {record.isCarUsed ? '🚗' : '🛵'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800">
                      {formatDate(record.date)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {record.isCarUsed ? 'Car' : 'Scooty'}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditRecord(record)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => record._id && onDeleteRecord(record._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {record.isCarUsed && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {record.distanceTravel && (
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium ml-1">
                        {record.distanceTravel} km
                      </span>
                    </div>
                  )}
                  {record.avgKmpl && (
                    <div>
                      <span className="text-gray-600">Average:</span>
                      <span className="font-medium ml-1">
                        {record.avgKmpl} km/l
                      </span>
                    </div>
                  )}
                  {record.petrolExpense && (
                    <div>
                      <span className="text-gray-600">Expense:</span>
                      <span className="font-medium ml-1 text-red-600">
                        ₹{record.petrolExpense}/litre
                      </span>
                    </div>
                  )}
                </div>
              )}

              {record.notes && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Notes:</span>
                  <span className="ml-1 text-gray-800">{record.notes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};