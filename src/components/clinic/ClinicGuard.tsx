import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, UserRole } from '../../lib/clinic';

interface ClinicGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ClinicGuard: React.FC<ClinicGuardProps> = ({ children, requiredRole }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-psy-bg flex items-center justify-center p-6" dir="rtl">
          <div className="glass max-w-md w-full p-8 text-center space-y-4" role="alert">
            <h1 className="text-xl font-black text-psy-text mb-0">غير مصرح بالوصول</h1>
            <p className="text-sm text-psy-text/50 mb-0">
              ليس لديك صلاحية للوصول إلى هذه المنطقة. يرجى تسجيل الدخول بحساب مناسب.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-xl font-bold bg-psy-gold text-psy-bg"
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
