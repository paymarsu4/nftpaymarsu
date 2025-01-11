import useSWR from 'swr'
import customAxios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();
    const params = useParams();

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        customAxios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status === 409) {
                    router.push('/verify-email');
                } else if (error.response?.status === 401) {
                    logout(); // Handle session expiration
                } else {
                    throw error; // Rethrow for unhandled errors
                }
            }),
    );

    const csrf = () => customAxios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);

        customAxios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        try {
            await csrf(); // Ensure CSRF token is fetched
    
            setErrors([]);
            setStatus(null);
    
            await customAxios.post('/login', props);
            mutate(); // Refresh user data
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors); // Handle validation errors
            } else {
                throw error; // Rethrow for unhandled errors
            }
        }
    };

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        customAxios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        customAxios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });
    }

    const resendEmailVerification = ({ setStatus }) => {
        customAxios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status));
    }

    const logout = async () => {
        try {
            if (!error) {
                await customAxios.post('/logout');
                mutate(null, false); // Reset user data in SWR
            }
        } catch (e) {
            console.error('Logout failed:', e);
        } finally {
            window.location.pathname = '/login';
        }
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }
    
        if (middleware === 'auth') {
            if (error) {
                logout(); // Handle error (e.g., session expired)
            } else if (!user?.email_verified_at) {
                router.push('/verify-email');
            } else if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
                router.push(redirectIfAuthenticated || '/');
            }
        }
    }, [user, error, middleware, redirectIfAuthenticated]);

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}