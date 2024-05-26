import { useState } from 'react';

const useFetch = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (endpoint, options = {}, token = null) => {
        setLoading(true);
        setError(null)
        try {
            const response = await fetch(`http://${process.env.IP_ADDRESS}:${process.env.SERVER_PORT}/api/${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization header if token exists
                    ...(options.headers || {}), // Add custom headers if provided in options
                },
            });
            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.error || 'Fetch failed');
            }
            setData(json);
            setError(null);
        } catch (error) {
            setError(error.message || 'Fetch failed');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchData };
}

export default useFetch;
