import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStaffDashboardPath } from '@/utils/postLoginNavigation';

const DashboardRedirect = () => {
    const { agent, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && agent) {
            navigate(getStaffDashboardPath(agent.role, agent.hasChangedPassword), { replace: true });
        } else if (!loading && !agent) {
            navigate('/login', { replace: true });
        }
    }, [agent, loading, navigate]);

    return <div className="p-8 text-center text-gray-500">Redirecting...</div>;
};

export default DashboardRedirect;
