import useFetch from "./useFetch";

const useApiService = () => {
    const { loading, data, error, fetchData } = useFetch();
    
    const login = async (email, password) => {
        await fetchData('login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
    
    const signup = async (email, password, username) => {
        await fetchData('signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, username })
        });
    }

    return { login, signup, loading, data, error }
}

export default useApiService