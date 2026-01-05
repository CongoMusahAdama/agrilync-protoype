import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
    const { agent, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && agent) {
            if (agent.role === 'super_admin') {
                navigate('/dashboard/super-admin', { replace: true });
            } else if (agent.role === 'supervisor') {
                // Future: navigate('/dashboard/supervisor', { replace: true });
                // For now, supervisors might share agent dashboard or have their own
                navigate('/dashboard/agent', { replace: true });
            } else {
                navigate('/dashboard/agent', { replace: true });
            }
        } else if (!loading && !agent) {
            navigate('/login', { replace: true });
        }
    }, [agent, loading, navigate]);

    return <div className="p-8 text-center text-gray-500">Redirecting...</div>;
};

export default DashboardRedirect;
