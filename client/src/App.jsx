import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Area */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                  <Navbar />
                  <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}