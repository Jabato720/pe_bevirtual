import React from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessModelSelector from '../components/BusinessModelSelector';

const BusinessModelSelectorPage = () => {
  const navigate = useNavigate();

  const handleModelSelect = (selectedModel) => {
    // Guardar modelo seleccionado en localStorage para usar en ProfessionalCalculator
    localStorage.setItem('selectedBusinessModel', JSON.stringify(selectedModel));
    
    // Navegar a ProfessionalCalculator
    navigate('/professional');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <BusinessModelSelector 
      onModelSelect={handleModelSelect}
      onBack={handleBack}
    />
  );
};

export default BusinessModelSelectorPage;