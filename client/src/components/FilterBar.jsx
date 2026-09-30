import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
  'Food & Dining',
  'Rent & Utilities',
  'Entertainment',
  'Transportation',
  'Healthcare',
  'Shopping',
  'Other',
];

export default function FilterBar({ filters, setFilters, pagination, onPageChange, onReset }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Type Toggle Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              onClick={() => setFilters((prev) => ({ ...prev, type: t === 'all' ? '' : t, page: 1 }))}
              className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-md transition ${
                (t === 'all' && !filters.type) || filters.type === t
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Dropdowns: Category, Month, Year */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'All' ? '' : c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Month Selector */}
          <select
            value={filters.month}
            onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value, page: 1 }))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={filters.year}
            onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value, page: 1 }))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Reset Action */}
          <button
            onClick={onReset}
            title="Reset Filters"
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2.5 py-2 rounded-lg text-xs transition"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div>
          Showing page <span className="text-white font-semibold">{pagination.page}</span> of{' '}
          <span className="text-white font-semibold">{pagination.pages}</span> ({pagination.total} records)
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="p-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="p-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}