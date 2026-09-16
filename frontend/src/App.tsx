import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/livros" element={<Books />} />
      <Route path="/livros/:id" element={<BookDetail />} />
      <Route path="/minha-estante" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trocas" element={<ProtectedRoute><Trades /></ProtectedRoute>} />
    </Routes>
  );
}