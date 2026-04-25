import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import Home        from './pages/Home';
import Blogs       from './pages/Blogs';
import BlogDetail  from './pages/BlogDetail';
import CreateBlog  from './pages/CreateBlog';
import MyBlogs     from './pages/MyBlogs';
import Feed        from './pages/Feed';
import Profile     from './pages/Profile';
import Community   from './pages/Community';
import About       from './pages/About';
import Contact     from './pages/Contact';
import FAQ         from './pages/FAQ';
import Login       from './pages/Login';
import Register    from './pages/Register';

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="loader-center"><div className="spinner" /></div>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="loader-center"><div className="spinner" /></div>;
  return !isLoggedIn ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"           element={<Home />} />
        <Route path="/blogs"      element={<Blogs />} />
        <Route path="/blogs/:id"  element={<BlogDetail />} />
        <Route path="/community"  element={<Community />} />
        <Route path="/about"      element={<About />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/faq"        element={<FAQ />} />

        {/* Protected */}
        <Route path="/write"      element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/write/:id"  element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/my-blogs"   element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
        <Route path="/feed"       element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Guest only */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
