// File: pages/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "../components/Calendar";
import { ExpenseForm } from "../components/ExpenseForm";
import { Statistics } from "../components/Statistics";
import { TransactionList } from "../components/TransactionList";
import { DailyRecord } from "../types";

export default function Home() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [allRecords, setAllRecords] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "transactions">(
    "calendar"
  );

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/records?month=${currentMonth}&year=${currentYear}`
      );
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecords = async () => {
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      setAllRecords(data);
    } catch (error) {
      console.error("Error fetching all records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchAllRecords();
  }, [currentMonth, currentYear]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleEditRecord = (record: DailyRecord) => {
    setSelectedDate(record.date);
    setShowForm(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(`/api/records?id=${recordId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchRecords();
          await fetchAllRecords();
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleSaveRecord = async (record: DailyRecord) => {
    try {
      const existingRecord = records.find((r) => r.date === record.date);
      const method = existingRecord ? "PUT" : "POST";
      const url = "/api/records";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        await fetchRecords();
        await fetchAllRecords();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedDate("");
  };

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const selectedRecord = records.find((r) => r.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-md mx-auto p-4">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Petrol Expense Manager
          </h1>
          <p className="text-gray-600">Track your car usage and expenses</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "calendar"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            📅 Calendar
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              activeTab === "transactions"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            📋 Transactions
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        <Statistics records={records} />

        {activeTab === "calendar" && (
          <Calendar
            records={records}
            onDateClick={handleDateClick}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionList
            records={allRecords}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {showForm && (
          <ExpenseForm
            selectedDate={selectedDate}
            existingRecord={selectedRecord}
            onSave={handleSaveRecord}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
