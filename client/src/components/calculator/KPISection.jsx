const KPISection = ({ kpis, formatCurrency }) => {
  const { breakEvenMonth, finalSocios, ingresosY1, ebitdaY1Percent, currentCashflow } = kpis;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Métricas Clave</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="kpi-card">
          <div className="value">
            {breakEvenMonth ? `Mes ${breakEvenMonth}` : 'Nunca'}
          </div>
          <div className="label">Punto de Equilibrio</div>
        </div>
        <div className="kpi-card">
          <div className="value">
            {finalSocios}
          </div>
          <div className="label">Socios al Mes 24</div>
        </div>
        <div className="kpi-card">
          <div className="value">
            {formatCurrency(ingresosY1 / 1000)}k
          </div>
          <div className="label">Ingresos (12 meses op.)</div>
        </div>
        <div className="kpi-card">
          <div className="value">
            {ingresosY1 > 0 ? `${ebitdaY1Percent}%` : 'N/A'}
          </div>
          <div className="label">% EBITDA (12 meses op.)</div>
        </div>
        <div className="kpi-card">
          <div className="value">
            {formatCurrency(currentCashflow / 1000)}k
          </div>
          <div className="label">Flujo de Caja Acum. (Mes 24)</div>
        </div>
      </div>
    </div>
  );
};

export default KPISection;
