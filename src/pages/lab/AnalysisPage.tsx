import React from 'react';
import { PsychometricAnalysis } from '../../components/lab/PsychometricAnalysis';
import { LabBackButton } from '../../components/lab/LabBackButton';

export const AnalysisPage: React.FC = () => {
  return (
    <>
      <div className="space-y-6">
        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />
        <PsychometricAnalysis />
      </div>
    </>
  );
};
