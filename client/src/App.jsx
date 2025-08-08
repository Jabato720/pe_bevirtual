import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import ProfessionalCalculator from './pages/ProfessionalCalculator';
import BusinessModelSelectorPage from './pages/BusinessModelSelectorPage';
import PlansList from './components/PlansList';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/plans" element={<PrivateRoute element={<PlansList />} />} />
      <Route path="/calculator/:id?" element={<PrivateRoute element={<Calculator />} />} />
      <Route path="/business-model-selector" element={<PrivateRoute element={<BusinessModelSelectorPage />} />} />
      <Route path="/professional/:id?" element={<PrivateRoute element={<ProfessionalCalculator />} />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
