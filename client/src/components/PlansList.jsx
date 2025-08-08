import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PlansList = ({ plans, setPlans }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const deletePlan = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await axios.delete(`/api/plan/${id}`);
      setPlans(plans.filter(plan => plan.id !== id));
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError('Error al eliminar el plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-color"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No tienes planes financieros guardados.</p>
          <Link to="/calculator" className="btn btn-primary">
            Crear tu primer plan
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
                <tr key={plan.id} className="border-b border-gray-200">
                  <td className="py-3">{plan.name}</td>
                  <td className="py-3">{plan.description || 'Sin descripción'}</td>
                  <td className="py-3">{formatDate(plan.created_at)}</td>
                  <td className="py-3">{formatDate(plan.updated_at)}</td>
                  <td className="py-3">
                    <div className="flex space-x-4">
                      <Link to={`/calculator/${plan.id}`} className="text-accent-color hover:underline">
                        Editar
                      </Link>
                      <button 
                        onClick={() => deletePlan(plan.id)} 
                        className="text-red-500 hover:underline"
                        disabled={loading}
                      >
                        Eliminar
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
  );
};

export default PlansList;
