import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Patient {
  patient_id: string;
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  reportType?: string;
  phone: string;
  address?: string;
  notes?: string;
  fullReport?: string;
}

interface PatientSessionContextType {
  currentPatient: Patient | null;
  selectPatient: (patient: Patient) => void;
  clearSession: () => void;
  isPatientSelected: boolean;
}

const PatientSessionContext = createContext<PatientSessionContextType | undefined>(undefined);

export const PatientSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const selectPatient = (patient: Patient) => {
    setCurrentPatient(patient);
  };

  const clearSession = () => {
    setCurrentPatient(null);
  };

  return (
    <PatientSessionContext.Provider value={{
      currentPatient,
      selectPatient,
      clearSession,
      isPatientSelected: currentPatient !== null
    }}>
      {children}
    </PatientSessionContext.Provider>
  );
};

export const usePatientSession = () => {
  const context = useContext(PatientSessionContext);
  if (context === undefined) {
    throw new Error('usePatientSession must be used within a PatientSessionProvider');
  }
  return context;
};
