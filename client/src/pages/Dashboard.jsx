import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('/api/plan');
        setPlans(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Error al cargar los planes');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="grid grid-cols-3 items-center">
            <div className="w-1/3"></div>
            <div className="flex flex-col items-center text-center">
              <svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 914.28 256.16" className="h-12 w-auto">
                <defs>
                  <style>{`.cls-1 { fill: #1e1f1d; }`}</style>
                </defs>
                <g id="Layer_1" data-name="Layer 1">
                  <g>
                    <g>
                      <path className="cls-1" d="M316.27,197l-35.63-91.31h14.86l29.54,75.74,29.54-75.74h13.97l-35.63,91.31h-16.65Z"/>
                      <path className="cls-1" d="M385.56,105.68h36.35v62.67c0,7.76,1.73,12.92,5.19,15.49,3.46,2.57,10.09,3.13,19.87,1.7v11.46c-5.49.84-10.24,1.31-14.23,1.43-4,.12-7.46-.42-10.38-1.61-2.92-1.19-5.31-2.6-7.16-4.21-1.85-1.61-3.31-3.82-4.39-6.62s-1.82-5.67-2.24-8.59c-.42-2.92-.63-6.36-.63-10.29v-49.42h-22.38v-12ZM407.94,67.55h13.97v20.23h-13.97v-20.23Z"/>
                      <path className="cls-1" d="M463.98,185h22.38v-46.91c0-12.65,4.48-21.9,13.43-27.75,8.95-5.85,20.89-7.58,35.81-5.19v12.53c-10.27-2.27-18.71-1.43-25.33,2.51-6.62,3.94-9.94,9.91-9.94,17.9v46.91h27.75v12h-64.1v-12Z"/>
                      <path className="cls-1" d="M591.64,164.77c0,9.55,1.82,15.76,5.46,18.62,3.64,2.87,11.19,3.58,22.65,2.15v11.46c-6.09.72-11.34,1.19-15.76,1.43-4.42.24-8.18-.33-11.28-1.7-3.1-1.37-5.64-2.89-7.61-4.57-1.97-1.67-3.49-4.09-4.57-7.25s-1.82-6.39-2.24-9.67c-.42-3.28-.63-7.19-.63-11.73v-45.84h-25.07v-12h67.14v12h-28.11v47.09Z"/>
                      <path className="cls-1" d="M661.82,105.68v59.62c0,7.04,2.12,12.38,6.36,16.03s10.06,5.46,17.46,5.46,13.22-1.82,17.46-5.46,6.36-8.98,6.36-16.03v-59.62h13.96v58.73c0,11.1-3.37,19.61-10.12,25.51-6.74,5.91-15.96,8.86-27.66,8.86s-20.74-2.95-27.48-8.86c-6.74-5.91-10.12-14.41-10.12-25.51v-58.73h13.79Z"/>
                      <path className="cls-1" d="M760.47,150.54c5.97-4.6,14.26-6.89,24.89-6.89,12.41,0,21.67,3.04,27.75,9.13v-17.55c0-6.45-1.94-11.37-5.82-14.77-3.88-3.4-9.22-5.1-16.03-5.1-7.16,0-12.5,1.4-16.02,4.21s-5.28,7.31-5.28,13.52h-13.96c0-19.46,11.76-29.18,35.27-29.18,11.1,0,19.81,2.71,26.14,8.15,6.33,5.43,9.49,13.46,9.49,24.08v32.23c0,7.64,1.13,12.77,3.4,15.4,2.27,2.63,6.51,3.22,12.71,1.79v11.46c-14.8,3.58-23.99-.06-27.57-10.92-5.73,8.48-15.82,12.71-30.26,12.71-10.5,0-18.74-2.3-24.71-6.89-5.97-4.59-8.95-11.49-8.95-20.68s2.98-16.08,8.95-20.68ZM788.76,186.79c7.4,0,13.31-1.4,17.73-4.21,4.42-2.81,6.62-6.77,6.62-11.91s-2.21-9.07-6.62-11.82c-4.42-2.75-10.33-4.12-17.73-4.12-15.52,0-23.28,5.31-23.28,15.93s7.76,16.11,23.28,16.11Z"/>
                      <path className="cls-1" d="M852.86,64.5h36.35v103.85c0,7.76,1.73,12.92,5.19,15.49,3.46,2.57,10.09,3.13,19.88,1.7v11.46c-5.49.84-10.24,1.31-14.23,1.43-4,.12-7.46-.42-10.38-1.61-2.92-1.19-5.31-2.6-7.16-4.21-1.85-1.61-3.31-3.82-4.39-6.62s-1.82-5.67-2.24-8.59c-.42-2.92-.63-6.36-.63-10.29v-90.6h-22.38v-12Z"/>
                    </g>
                    <g>
                      <path className="cls-1" d="M56.16,60.6v42.28c0,1.2,1.37,1.86,2.32,1.12,5.39-4.17,12.39-6.25,21.02-6.25,10.41,0,18.62,3.25,24.63,9.74,6,6.49,9.01,15.93,9.01,28.3v23.16c0,12.38-3.74,21.81-11.21,28.3-7.47,6.49-17.7,9.74-30.69,9.74s-23.03-3.25-30.51-9.74c-7.47-6.49-11.21-15.93-11.21-28.3V60.6c0-.8.65-1.44,1.44-1.44h23.76c.8,0,1.44.65,1.44,1.44ZM60.21,124.04c-2.7,2.2-4.04,5.51-4.04,9.93v26.83c0,8.82,5.02,13.23,15.07,13.23,4.78,0,8.52-1.1,11.21-3.31,2.7-2.2,4.04-5.51,4.04-9.92v-26.83c0-8.82-5.02-13.23-15.07-13.23-4.78,0-8.52,1.1-11.21,3.31Z"/>
                      <path className="cls-1" d="M203.85,165.99h18.9c2.15,0,3.9,1.75,3.9,3.9v18.9c0,2.15-1.75,3.9-3.9,3.9h-18.9c-2.15,0-3.9-1.75-3.9-3.9v-18.9c0-2.15,1.75-3.9,3.9-3.9Z"/>
                      <path className="cls-1" d="M171.39,174.03c-4.9,0-8.64-1.16-11.21-3.49-2.57-2.33-3.86-5.57-3.86-9.74v-3.73c0-.78.63-1.41,1.41-1.41h54.15c.78,0,1.41-.63,1.41-1.41v-18.43c0-12.38-3.74-21.81-11.21-28.3-7.47-6.49-17.64-9.74-30.51-9.74s-23.22,3.25-30.69,9.74c-7.47-6.49-11.21,15.93-11.21,28.3v23.16c0,12.38,3.77,21.81,11.3,28.3,7.53,6.49,17.67,9.74,30.42,9.74h15.28c.78,0,1.41-.63,1.41-1.41v-20.15c0-.78-.63-1.41-1.41-1.41h-15.28ZM156.32,133.96c0-4.41,1.35-7.72,4.04-9.93,2.7-2.2,6.43-3.31,11.21-3.31,10.05,0,15.07,4.41,15.07,13.23v2.39h-30.32v-2.39Z"/>
                    </g>
                    <path d="M217.92,256.16H38.24c-21.09,0-38.24-17.16-38.24-38.24V38.24C0,17.16,17.16,0,38.24,0h179.67c21.09,0,38.24,17.16,38.24,38.24v179.68c0,21.09-17.16,38.24-38.24,38.24ZM38.24,14c-13.37,0-24.24,10.88-24.24,24.24v179.68c0,13.37,10.88,24.24,24.24,24.24h179.67c13.37,0,24.24-10.88,24.24-24.24V38.24c0-13.37-10.88-24.24-24.24-24.24H38.24Z"/>
                  </g>
                </g>
              </svg>
              <h1 className="text-2xl font-bold text-gray-800 mt-4">Plan de Viabilidad Económica</h1>
              <p className="text-lg text-gray-500">{user?.company_name || 'Tu Empresa'}</p>
            </div>
            <div className="flex justify-end items-center">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">{user?.email}</div>
                <button onClick={logout} className="text-xs text-gray-500 hover:text-accent-color">Cerrar sesión</button>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Mis Planes Financieros</h2>
            <Link to="/business-model-selector" className="btn btn-primary">
              🚀 Crear Nuevo Plan
            </Link>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No tienes planes financieros guardados.</p>
              <Link to="/business-model-selector" className="btn btn-primary">
                🚀 Crear tu primer plan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Nombre</th>
                    <th className="text-left">Descripción</th>
                    <th className="text-left">Fecha de creación</th>
                    <th className="text-left">Última actualización</th>
                    <th className="text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td className="py-3">{plan.name}</td>
                      <td className="py-3">{plan.description || 'Sin descripción'}</td>
                      <td className="py-3">{formatDate(plan.created_at)}</td>
                      <td className="py-3">{formatDate(plan.updated_at)}</td>
                      <td className="py-3">
                        <Link to={`/calculator/${plan.id}`} className="text-accent-color hover:underline mr-4">
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
