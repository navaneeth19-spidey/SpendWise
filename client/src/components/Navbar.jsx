import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, LayoutDashboard, ReceiptText } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-emerald-400">
        <Wallet className="h-6 w-6" />
        SpendWise
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-emerald-400 text-sm">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link to="/transactions" className="flex items-center gap-1.5 hover:text-emerald-400 text-sm">
          <ReceiptText className="h-4 w-4" /> Transactions
        </Link>
        <span className="text-sm text-slate-400">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </nav>
  );
}