import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as clinic_lib from '../../lib/clinic';
import { PageLoader } from '../shared/PageLoader';
import { getDashboardPath } from './Navbar';

export function DashboardWrapper() {
  const navigate = useNavigate();
  const user = clinic_lib.getCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/auth');
    } else {
      navigate(getDashboardPath(user?.role), { replace: true });
    }
  }, [userId, user?.role, navigate]);

  return <PageLoader label="جاري تحويلك إلى لوحة التحكم..." />;
}
