import React, { useState, useEffect } from 'react';
import { DailyRecord } from '../types';

interface CalendarProps {
  records: DailyRecord[];
  onDateClick: (date: string) => void;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  records,
  onDateClick,
  currentMonth,
  currentYear,
  onMonthChange
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getRecordForDate = (date: string) => {
    return records.find(record => record.date === date);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const record = getRecordForDate(date);
      const isToday = new Date().toISOString().split('T')[0] === date;

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(date)}
          className={`
            p-2 text-center cursor-pointer rounded-lg border-2 transition-all
            ${isToday ? 'border-blue-500' : 'border-gray-200'}
            ${record?.isCarUsed ? 'bg-green-100 text-green-800' : 'bg-white'}
            ${record && !record.isCarUsed ? 'bg-gray-100 text-gray-600' : ''}
            hover:bg-blue-50 hover:border-blue-300
          `}
        >
          <div className="text-sm font-medium">{day}</div>
          {record && (
            <div className="text-xs mt-1">
              {record.isCarUsed ? '🚗' : '🛵'}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        onMonthChange(12, currentYear - 1);
      } else {
        onMonthChange(currentMonth - 1, currentYear);
      }
    } else {
      if (currentMonth === 12) {
        onMonthChange(1, currentYear + 1);
      } else {
        onMonthChange(currentMonth + 1, currentYear);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[currentMonth - 1]} {currentYear}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};