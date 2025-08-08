import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import FixedCostsSection from '../components/calculator/FixedCostsSection';
import KPISection from '../components/calculator/KPISection';
import ProjectionTable from '../components/calculator/ProjectionTable';
import FinancialCharts from '../components/calculator/FinancialCharts';

const Calculator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [planName, setPlanName] = useState('Nuevo Plan Financiero');
  const [planDescription, setPlanDescription] = useState('');

  // Financial inputs
  const [financialInputs, setFinancialInputs] = useState({
    inversion: 500000,
    cuotaMensual: 70,
    ingresoPT: 0,
    cuotaInscripcion: 0,
    churnRate: 5,
    costeVariable: 15,
    costeLlave: 0,
    tasaMorosos: 0,
    cac: 50
  });

  // Fixed costs
  const [fixedCosts, setFixedCosts] = useState([
    { id: 'costeAlquiler', label: 'Alquiler del Local', value: 5000 },
    { id: 'costeLeasing', label: 'Leasing Material Fitness', value: 0 },
    { id: 'costePersonal', label: 'Salarios Inc. SS.SS', value: 13750 },
    { id: 'costeSuministros', label: 'Suministros (Luz, Agua, Net)', value: 2000 },
    { id: 'costeSeguros', label: 'Seguros (Insurance)', value: 300 },
    { id: 'costeGestoria', label: 'Gastos de Gestoría', value: 0 },
    { id: 'costeMantenimiento', label: 'Mantenimiento', value: 500 },
    { id: 'costeLicencias', label: 'Licencias (SGAE, Les Mills, etc.)', value: 750 },
    { id: 'costeMarketing', label: 'Marketing Fijo y Branding', value: 1000 },
    { id: 'costeOtros', label: 'Otros Costes Operativos / Admón.', value: 1700 },
    { id: 'costePrestamo', label: 'Cuota Préstamo Financiación', value: 0 },
  ]);

  // Financial results
  const [financialResults, setFinancialResults] = useState({
    totalCostesFijos: 0,
    clients: [],
    pl: {},
    cashflow: {},
    kpis: {
      breakEvenMonth: null,
      finalSocios: 0,
      ingresosY1: 0,
      ebitdaY1: 0,
      ebitdaY1Percent: 0,
      currentCashflow: 0
    }
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get color class based on value
  const getColorClass = (value) => value >= 0 ? 'text-green-600' : 'text-red-600';

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFinancialInputs(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }));
  };

  // Get new members plan
  const getNewMembersPlan = () => {
    const plan = Array(25).fill(0);
    plan[9] = 100; plan[10] = 400; plan[11] = 150; plan[12] = 150;
    for (let i = 13; i <= 24; i++) { plan[i] = 75; }
    return plan;
  };

  // Calculate financials
  const calculateFinancials = () => {
    const {
      cuotaMensual,
      ingresoPT,
      cuotaInscripcion,
      churnRate,
      costeVariable,
      costeLlave,
      tasaMorosos,
      cac,
      inversion
    } = financialInputs;

    const totalCosteFijo = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);
    const capitalTrabajo = 125000;
    const gastosPreOp = inversion - capitalTrabajo;

    let sociosTotales = 0;
    let flujoCajaAcumulado = capitalTrabajo;
    let breakEvenMonth = null;
    let ingresosY1 = 0;
    let ebitdaY1 = 0;
    let finalSocios = 0;
    const newMembersPlan = getNewMembersPlan();
    
    let results = { clients: [], pl: {}, cashflow: {} };
    const months = Array.from({length: 16}, (_, i) => i + 9);
    
    months.forEach(mes => {
      const sociosInicio = sociosTotales;
      const sociosNuevos = newMembersPlan[mes];
      const sociosPerdidos = mes > 9 ? Math.round(sociosTotales * (churnRate / 100)) : 0;
      sociosTotales = sociosInicio - sociosPerdidos + sociosNuevos;
      results.clients.push({
        mes, 
        sociosInicio, 
        sociosNuevos, 
        sociosPerdidos, 
        sociosNetos: sociosNuevos - sociosPerdidos, 
        sociosTotales
      });

      const ingresosCuotas = sociosTotales * cuotaMensual;
      const ingresosInscripcion = sociosNuevos * cuotaInscripcion;
      const totalIngresosBruto = ingresosCuotas + ingresoPT + ingresosInscripcion;
      const perdidaMorosidad = totalIngresosBruto * (tasaMorosos / 100);
      const totalIngresosNeto = totalIngresosBruto - perdidaMorosidad;
      
      const costeVariableTotal = sociosTotales * costeVariable;
      const costeLlavesTotal = sociosNuevos * costeLlave;
      const costeAdquisicion = sociosNuevos * cac;
      const totalGastosVariables = costeVariableTotal + costeLlavesTotal + costeAdquisicion;
      const totalGastos = totalGastosVariables + totalCosteFijo;

      const ebitda = totalIngresosNeto - totalGastos;
      
      if (ebitda > 0 && breakEvenMonth === null) breakEvenMonth = mes;
      if (mes >= 9 && mes <= 20) { 
        ingresosY1 += totalIngresosNeto; 
        ebitdaY1 += ebitda; 
      }
      if (mes === 24) finalSocios = sociosTotales;
      
      const plData = { 
        totalIngresosNeto, 
        perdidaMorosidad, 
        totalGastos, 
        ebitda 
      };
      
      for (const key in plData) {
        if (!results.pl[key]) results.pl[key] = [];
        results.pl[key].push(plData[key]);
      }
    });

    // Calculate cash flow
    let currentCashflow = capitalTrabajo;
    results.cashflow.neto = [capitalTrabajo];
    results.cashflow.acumulado = [capitalTrabajo];

    results.pl.ebitda.forEach(ebitda => {
      currentCashflow += ebitda;
      results.cashflow.neto.push(ebitda);
      results.cashflow.acumulado.push(currentCashflow);
    });

    setFinancialResults({
      totalCostesFijos: totalCosteFijo,
      clients: results.clients,
      pl: results.pl,
      cashflow: results.cashflow,
      kpis: {
        breakEvenMonth,
        finalSocios,
        ingresosY1,
        ebitdaY1,
        ebitdaY1Percent: ingresosY1 > 0 ? ((ebitdaY1/ingresosY1)*100).toFixed(1) : 0,
        currentCashflow
      }
    });
  };

  // Save plan
  const savePlan = async () => {
    if (!planName.trim()) {
      setError('Por favor, introduce un nombre para el plan');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const planData = {
        name: planName,
        description: planDescription,
        inputs: financialInputs,
        fixed_costs: fixedCosts,
        results: financialResults
      };

      if (id) {
        await axios.put(`/api/plan/${id}`, planData);
      } else {
        await axios.post('/api/plan', planData);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Error al guardar el plan');
    } finally {
      setSaving(false);
    }
  };

  // Load plan
  useEffect(() => {
    if (id) {
      const loadPlan = async () => {
        try {
          const res = await axios.get(`/api/plan/${id}`);
          const plan = res.data;
          
          setPlanName(plan.name);
          setPlanDescription(plan.description || '');
          setFinancialInputs(plan.inputs);
          setFixedCosts(plan.fixed_costs);
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading plan:', err);
          setError('Error al cargar el plan');
          setLoading(false);
        }
      };

      loadPlan();
    }
  }, [id]);

  // Calculate financials when inputs change
  useEffect(() => {
    calculateFinancials();
  }, [financialInputs, fixedCosts]);

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
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Detalles del Plan</h2>
            <button 
              onClick={savePlan} 
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Guardando...' : id ? 'Actualizar Plan' : 'Guardar Plan'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="input-group">
              <label htmlFor="planName">Nombre del Plan</label>
              <input 
                type="text" 
                id="planName" 
                value={planName} 
                onChange={(e) => setPlanName(e.target.value)}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="planDescription">Descripción (opcional)</label>
              <input 
                type="text" 
                id="planDescription" 
                value={planDescription} 
                onChange={(e) => setPlanDescription(e.target.value)}
                className="main-input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Supuestos Generales y de Ingresos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6">
            <div className="input-group">
              <label htmlFor="inversion">Inversión Inicial (€)</label>
              <input 
                type="number" 
                id="inversion" 
                value={financialInputs.inversion} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="cuotaMensual">Cuota Mensual / Socio (€)</label>
              <input 
                type="number" 
                id="cuotaMensual" 
                value={financialInputs.cuotaMensual} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="ingresoPT">Ingreso Neto Personal Training (€/mes)</label>
              <input 
                type="number" 
                id="ingresoPT" 
                value={financialInputs.ingresoPT} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="cuotaInscripcion">Cuota Inscripción / Nuevo Socio (€)</label>
              <input 
                type="number" 
                id="cuotaInscripcion" 
                value={financialInputs.cuotaInscripcion} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Supuestos de Costes y Pérdidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6">
            <div className="input-group">
              <label htmlFor="churnRate">Tasa de Bajas Mensual (%)</label>
              <input 
                type="number" 
                id="churnRate" 
                value={financialInputs.churnRate} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="costeVariable">Coste Variable / Socio (€)</label>
              <input 
                type="number" 
                id="costeVariable" 
                value={financialInputs.costeVariable} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="costeLlave">Coste Llave / Nuevo Socio (€)</label>
              <input 
                type="number" 
                id="costeLlave" 
                value={financialInputs.costeLlave} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="tasaMorosos">Tasa de Morosos (%)</label>
              <input 
                type="number" 
                id="tasaMorosos" 
                value={financialInputs.tasaMorosos} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="cac">Coste Adquisición Cliente (€)</label>
              <input 
                type="number" 
                id="cac" 
                value={financialInputs.cac} 
                onChange={handleInputChange}
                className="main-input"
              />
            </div>
          </div>
        </div>

        <FixedCostsSection 
          fixedCosts={fixedCosts} 
          setFixedCosts={setFixedCosts} 
          totalCostesFijos={financialResults.totalCostesFijos}
          formatCurrency={formatCurrency}
        />

        <KPISection 
          kpis={financialResults.kpis}
          formatCurrency={formatCurrency}
        />

        <ProjectionTable 
          clients={financialResults.clients}
          pl={financialResults.pl}
          cashflow={financialResults.cashflow}
          formatCurrency={formatCurrency}
          getColorClass={getColorClass}
        />

        <FinancialCharts 
          clients={financialResults.clients}
          pl={financialResults.pl}
          cashflow={financialResults.cashflow}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default Calculator;
