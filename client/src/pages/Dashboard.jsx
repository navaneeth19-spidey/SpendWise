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
} from 'recharts';
import { IndianRupee, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

// Refined, desaturated minimalist palette
const CATEGORY_COLORS = [
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#64748b', // Slate
];

// Minimalist custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-2 shadow-2xl text-xs">
        <p className="font-medium text-slate-300 mb-1">{label || payload[0]?.name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2 font-mono text-white">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span>{entry.name}:</span>
            <span className="font-semibold">₹{Number(entry.value).toLocaleString('en-IN')}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Date Pickers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Cash flow aggregation and distribution</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-700 transition"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'short' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-slate-700 transition"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Balance */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3 font-medium">
            <span>Net Balance</span>
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400">
              <IndianRupee className="h-3.5 w-3.5" />
            </div>
          </div>
          <div
            className={`text-2xl font-bold tracking-tight font-mono ${
              summary.netBalance >= 0 ? 'text-white' : 'text-rose-400'
            }`}
          >
            ₹{summary.netBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-normal">Income less expenses</p>
        </div>

        {/* Total Income */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3 font-medium">
            <span>Total Inflow</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight font-mono text-emerald-400">
            ₹{summary.totalIncome.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-normal">Recorded earnings this cycle</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3 font-medium">
            <span>Total Outflow</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight font-mono text-rose-400">
            ₹{summary.totalExpense.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-normal">Recorded expenses this cycle</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inflow vs Outflow Slim Bar Chart */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-slate-300">Inflow vs. Outflow</h2>
            {/* Custom minimalist indicator */}
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Outflow
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">Loading data...</div>
            ) : summary.totalIncome === 0 && summary.totalExpense === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">No activity logged</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={12} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1e293b' }}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
                  {/* Slim, elegant pill-shaped bars */}
                  <Bar dataKey="Income" fill="#10b981" barSize={26} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f43f5e" barSize={26} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Breakdown Slim Donut Chart */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" /> Expense Breakdown
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {pieData.length} {pieData.length === 1 ? 'Category' : 'Categories'}
            </span>
          </div>

          <div className="h-[260px] w-full flex flex-col sm:flex-row items-center justify-center gap-6">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">Loading data...</div>
            ) : pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">No expenses logged</div>
            ) : (
              <>
                <div className="w-full sm:w-1/2 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={86}
                        stroke="#0b0f19"
                        strokeWidth={3}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Minimalist custom category breakdown legend */}
                <div className="w-full sm:w-1/2 max-h-[190px] overflow-y-auto space-y-2 pr-1">
                  {pieData.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-slate-400 truncate">{cat.name}</span>
                      </div>
                      <span className="text-slate-300 font-mono ml-2">₹{cat.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}