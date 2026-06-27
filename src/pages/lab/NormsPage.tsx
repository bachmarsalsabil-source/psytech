import React from 'react';
import { NormManager } from '../../components/lab/NormManager';
import { LabBackButton } from '../../components/lab/LabBackButton';

export const NormsPage: React.FC = () => {
  return (
    <>
      <div className="space-y-6">
        <LabBackButton to="/lab/dashboard" label="العودة للمختبر" />
        <NormManager />
      </div>
    </>
  );
};
