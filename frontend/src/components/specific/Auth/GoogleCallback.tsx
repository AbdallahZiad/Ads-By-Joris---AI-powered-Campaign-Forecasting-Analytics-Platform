import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiRefresh } from 'react-icons/hi';

const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');

    useEffect(() => {
        if (code) {
            // We found a code! Redirect to the SignIn page
            // passing the code in the URL so SignIn can execute the mutation.
            navigate(`/auth/signin?code=${code}`, { replace: true });
        } else {
            // No code found at root? Go to scanner.
            navigate('/scanner', { replace: true });
        }
    }, [code, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <HiRefresh className="animate-spin mb-2" size={32} />
            <p>Completing secure sign in...</p>
        </div>
    );
};

export default GoogleCallback;