import MetricCard from '../metrics/MetricCard';
import Alert from '../alerts/Alert';

const ResumenExecutivo = ({ 
  calculatedResults, 
  financialData, 
  formatCurrency, 
  formatPercentage 
}) => {
  const {
    breakEvenSocios,
    breakEvenMes,
    sociosAno1,
    ebitdaAno1Percent,
    tirProyecto,
    vanProyecto,
    paybackReal,
    dscr
  } = calculatedResults;

  return (
    <div className="space-y-8">
      {/* Header Alert */}
      <Alert type="success" title="Proyecto VIABLE">
        Proyecto VIABLE en todos los escenarios analizados con TIR {formatPercentage(tirProyecto)}
      </Alert>

      {/* Primary Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicadores Clave de Viabilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon="💰"
            label="Inversión Solicitada"
            value={formatCurrency(financialData.inversion)}
            change="Plazo: 7 años"
          />
          <MetricCard
            icon="💳"
            label="Cuota Mensual / Socio"
            value={formatCurrency(financialData.cuotaMensual)}
            change="+7,7% vs competencia"
            changeType="positive"
          />
          <MetricCard
            icon="🎯"
            label="Break Even"
            value={`${breakEvenSocios}`}
            change={`socios (mes ${breakEvenMes})`}
          />
          <MetricCard
            icon="👥"
            label="Objetivo Año 1"
            value={`${sociosAno1.toLocaleString()}`}
            change="socios activos"
            changeType="positive"
          />
        </div>
      </div>

      {/* Financial Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Financiero</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon="🛡️"
            label="DSCR (Cobertura Deuda)"
            value={`${dscr}x`}
            change="Excelente (>1,5x requerido)"
            changeType="positive"
          />
          <MetricCard
            icon="📈"
            label="TIR Proyecto"
            value={formatPercentage(tirProyecto)}
            change="vs 15% media sector"
            changeType="positive"
          />
          <MetricCard
            icon="⏱️"
            label="Payback"
            value={`${paybackReal}`}
            change="meses"
          />
          <MetricCard
            icon="💎"
            label="VAN (7 años)"
            value={`${formatCurrency(vanProyecto / 1000)}k`}
            change="2,5x inversión"
            changeType="positive"
          />
        </div>
      </div>

      {/* Viability Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen de Viabilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold text-green-800">Viabilidad Técnica</div>
            <div className="text-sm text-green-600 mt-1">Mercado confirmado</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-semibold text-green-800">Viabilidad Económica</div>
            <div className="text-sm text-green-600 mt-1">TIR superior al sector</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">🏦</div>
            <div className="font-semibold text-green-800">Viabilidad Financiera</div>
            <div className="text-sm text-green-600 mt-1">DSCR excelente</div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Evaluación de Riesgos</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <span className="text-green-600 font-semibold">🟢</span>
              <span className="font-medium text-green-800">Riesgo de Mercado</span>
            </div>
            <span className="text-sm font-medium text-green-600">BAJO</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-600 font-semibold">🟡</span>
              <span className="font-medium text-yellow-800">Riesgo Operacional</span>
            </div>
            <span className="text-sm font-medium text-yellow-600">MEDIO</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <span className="text-green-600 font-semibold">🟢</span>
              <span className="font-medium text-green-800">Riesgo Financiero</span>
            </div>
            <span className="text-sm font-medium text-green-600">BAJO</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conclusión Ejecutiva</h3>
        <p className="text-gray-700 leading-relaxed">
          <strong>Reset Fitness</strong> presenta un modelo de negocio sólido con proyecciones financieras 
          conservadoras que superan los benchmarks del sector. La combinación de:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
          <li>TIR del <strong>{formatPercentage(tirProyecto)}</strong> vs media sector del 15%</li>
          <li>DSCR de <strong>{dscr}x</strong> garantiza cobertura de deuda</li>
          <li>Break-even en <strong>mes {breakEvenMes}</strong> reduce exposición al riesgo</li>
          <li>Payback de <strong>{paybackReal} meses</strong> acelera recuperación</li>
        </ul>
        <p className="mt-4 text-gray-700">
          Recomendamos la <strong>APROBACIÓN</strong> del proyecto con las garantías propuestas.
        </p>
      </div>
    </div>
  );
};

export default ResumenExecutivo;