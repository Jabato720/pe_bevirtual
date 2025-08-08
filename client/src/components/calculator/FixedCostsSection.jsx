import { useState } from 'react';

const FixedCostsSection = ({ fixedCosts, setFixedCosts, totalCostesFijos, formatCurrency }) => {
  // Handle cost label change
  const handleCostLabelChange = (index, value) => {
    const updatedCosts = [...fixedCosts];
    updatedCosts[index].label = value;
    setFixedCosts(updatedCosts);
  };

  // Handle cost value change
  const handleCostValueChange = (index, value) => {
    const updatedCosts = [...fixedCosts];
    updatedCosts[index].value = parseFloat(value) || 0;
    setFixedCosts(updatedCosts);
  };

  // Handle remove cost
  const handleRemoveCost = (index) => {
    const updatedCosts = fixedCosts.filter((_, i) => i !== index);
    setFixedCosts(updatedCosts);
  };

  // Add new cost
  const addCost = () => {
    setFixedCosts([
      ...fixedCosts,
      { id: `custom-${Date.now()}`, label: 'Nuevo Coste', value: 0 }
    ]);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Desglose de Costes Fijos Mensuales</h2>
        <button 
          onClick={addCost} 
          className="btn btn-primary text-sm"
        >
          Añadir Coste
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {fixedCosts.map((cost, index) => (
          <div key={cost.id} className="input-group flex items-end space-x-2">
            <div className="flex-grow">
              <label htmlFor={`cost-label-${index}`}>Concepto</label>
              <input 
                type="text" 
                id={`cost-label-${index}`} 
                value={cost.label} 
                onChange={(e) => handleCostLabelChange(index, e.target.value)}
                className="cost-label-input"
              />
            </div>
            <div className="flex-grow">
              <label htmlFor={`cost-value-${index}`}>Valor (€)</label>
              <input 
                type="number" 
                id={`cost-value-${index}`} 
                value={cost.value} 
                onChange={(e) => handleCostValueChange(index, e.target.value)}
                className="cost-value-input main-input"
              />
            </div>
            <button 
              className="btn btn-secondary remove-cost-btn mb-1" 
              onClick={() => handleRemoveCost(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-right">
        <span className="text-gray-500 font-medium">Total Costes Fijos Mensuales:</span>
        <span className="total-field ml-2">{formatCurrency(totalCostesFijos)}</span>
      </div>
    </div>
  );
};

export default FixedCostsSection;
