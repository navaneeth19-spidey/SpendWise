import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, PieChart as PieIcon } from 'lucide-react';

const PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    byCategory: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions/summary', {
        params: { month, year },
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const barData = [
    {
      name: 'Cash Flow',
      Income: summary.totalIncome,
      Expense: summary.totalExpense,
    },
  ];

  const pieData = summary.byCategory.map((cat) => ({
    name: cat._id,
    value: cat.totalAmount,
  }));

  return (
    <div className="space-y-6">
      {/* Title & Month/Year Control */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Overview</h1>
          <p className="text-sm text-slate-400">High-level cash flow aggregation and analytics</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Net Balance</span>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </div>
          <div
            className={`text-2xl font-bold ${
              summary.netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            ₹{summary.netBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Income minus Outflow</div>
        </div>

        {/* Total Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Total Income</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">₹{summary.totalIncome.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Aggregate inflow this month</div>
        </div>

        {/* Total Expense */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
            <span>Total Expenses</span>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">₹{summary.totalExpense.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Aggregate outflow this month</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <h2 className="text-md font-semibold text-white mb-4">Inflow vs. Outflow</h2>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Calculating metrics...
              </div>
            ) : summary.totalIncome === 0 && summary.totalExpense === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No cash flow logged for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <h2 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-emerald-400" /> Expense Breakdown
          </h2>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Aggregating categories...
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No expenses logged for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}