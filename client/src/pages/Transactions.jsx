import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';
import FilterBar from '../components/FilterBar';
import { Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const initialFilters = {
  type: '',
  category: '',
  month: '',
  year: '',
  page: 1,
  limit: 10,
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // Clean query parameters: omit empty string fields
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.transactions);
      setPagination({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total,
      });
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedTx) {
        await api.put(`/transactions/${selectedTx._id}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      setIsModalOpen(false);
      setSelectedTx(null);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction submission failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-400">View and manage your logged cash flows</p>
        </div>
        <button
          onClick={() => {
            setSelectedTx(null);
            setIsModalOpen(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition"
        >
          <Plus className="h-4 w-4" /> Add Record
        </button>
      </div>

      {/* Filter and Pagination Control Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        pagination={pagination}
        onPageChange={handlePageChange}
        onReset={handleResetFilters}
      />

      {/* Transaction Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading filtered records...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No matching transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                          t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {t.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      {t.title}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="bg-slate-800 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTx(t);
                            setIsModalOpen(true);
                          }}
                          className="p-1 hover:text-emerald-400 text-slate-400 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1 hover:text-red-400 text-slate-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedTx}
      />
    </div>
  );
}