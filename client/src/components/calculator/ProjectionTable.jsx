const ProjectionTable = ({ clients, pl, cashflow, formatCurrency, getColorClass }) => {
  // If no data is available yet, show loading state
  if (!clients || clients.length === 0 || !pl || !cashflow) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Proyección Financiera a 24 Meses
          </span>
        </h2>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-color"></div>
        </div>
      </div>
    );
  }

  // Get months from clients data
  const months = clients.map(client => client.mes);

  // Helper function to get enhanced color class with indicator
  const getEnhancedColorClass = (value) => {
    const baseClass = getColorClass(value);
    return `value-indicator ${baseClass}`;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 Proyección Financiera a 24 Meses
        </span>
      </h2>
      
      {/* Tabla de Movimiento de Clientes */}
      <div className="table-container financial-table">
        <table className="min-w-full">
          <thead>
            <tr>
              <th colSpan="6" className="section-title text-left">👥 Movimiento de Clientes</th>
            </tr>
            <tr>
              <th className="text-left">Mes</th>
              <th>Socios Inicio</th>
              <th>Altas</th>
              <th>Bajas</th>
              <th>Socios Neto</th>
              <th>Socios Final</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={index}>
                <td className="month-col">Mes {client.mes}</td>
                <td>{client.sociosInicio}</td>
                <td className="positive">+{client.sociosNuevos}</td>
                <td className="negative">-{client.sociosPerdidos}</td>
                <td className={client.sociosNetos > 0 ? 'positive' : 'negative'}>{client.sociosNetos}</td>
                <td className="total-field">{client.sociosTotales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Cuenta de Resultados */}
      <div className="table-container financial-table">
        <table className="min-w-full">
          <thead>
            <tr>
              <th colSpan={months.length + 1} className="section-title text-left">💰 Cuenta de Resultados (P&L)</th>
            </tr>
            <tr>
              <th className="text-left">Concepto</th>
              {months.map(month => (
                <th key={month}>Mes {month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="month-col">💵 Ingresos Netos</td>
              {pl.totalIngresosNeto && pl.totalIngresosNeto.map((value, index) => (
                <td key={index} className="positive">{formatCurrency(value)}</td>
              ))}
            </tr>
            <tr>
              <td className="month-col" style={{ paddingLeft: '2rem' }}>⚠️ Pérdida Morosidad</td>
              {pl.perdidaMorosidad && pl.perdidaMorosidad.map((value, index) => (
                <td key={index} className="negative">({formatCurrency(value)})</td>
              ))}
            </tr>
            <tr>
              <td className="month-col">💸 Total Gastos</td>
              {pl.totalGastos && pl.totalGastos.map((value, index) => (
                <td key={index} className="negative">({formatCurrency(value)})</td>
              ))}
            </tr>
            <tr className="ebitda-row">
              <td className="month-col">📈 EBITDA</td>
              {pl.ebitda && pl.ebitda.map((value, index) => (
                <td key={index} className={getEnhancedColorClass(value)}>{formatCurrency(value)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabla de Flujo de Caja */}
      <div className="table-container financial-table">
        <table className="min-w-full">
          <thead>
            <tr>
              <th colSpan={months.length + 1} className="section-title text-left">💳 Flujo de Caja</th>
            </tr>
            <tr>
              <th className="text-left">Concepto</th>
              {months.map(month => (
                <th key={month}>Mes {month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="month-col">🔄 Flujo de Caja Neto</td>
              {cashflow.neto && cashflow.neto.map((value, index) => (
                <td key={index} className={getEnhancedColorClass(value)}>{formatCurrency(value)}</td>
              ))}
            </tr>
            <tr className="cashflow-row">
              <td className="month-col">💰 Flujo de Caja Acumulado</td>
              {cashflow.acumulado && cashflow.acumulado.map((value, index) => (
                <td key={index} className={getEnhancedColorClass(value)}>{formatCurrency(value)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectionTable;
