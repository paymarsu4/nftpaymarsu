import useSWR from 'swr';
import customAxios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
    )

    const csrf = async () => {
        try {
            const response = await customAxios.get('/sanctum/csrf-cookie');
            console.log('CSRF Cookie Response:', response); // Log the response
        } catch (error) {
            console.error('Error fetching CSRF cookie:', error);
        }
    };

    const register = async ({ setErrors, ...props }) => {
        await csrf();
    
        setErrors([]);
    
        customAxios
            .post('/api/register', props)
            .then(() => mutate())
            .then(response => {
                console.log('Registration successful!', response.data);
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error('Unhandled registration error:', error);
                    throw error;
                }
            });
    };

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf();
    
        setErrors([]);
        setStatus(null);
    
        customAxios
            .post('/api/login', props)
            .then(() => mutate())
            .then(response => {
                console.log('Logged in!', response.data);
                setStatus('Login successful');
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else if (error.response?.status === 401) {
                    setErrors({ email: ['Invalid credentials'] });
                } else {
                    console.error('Unhandled login error:', error);
                    throw error;
                }
            });
    };    

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();
    
        setErrors([]);
        setStatus(null);
    
        customAxios
            .post('/api/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error('Unhandled forgot password error:', error);
                    throw error;
                }
            });
    };
    
    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf();
    
        setErrors([]);
        setStatus(null);
    
        customAxios
            .post('/api/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status))
            )
            .catch(error => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    console.error('Unhandled reset password error:', error);
                    throw error;
                }
            });
    };
    
    const resendEmailVerification = ({ setStatus }) => {
        customAxios
            .post('/api/email/verification-notification')
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response?.status === 422) {
                    console.error('Email verification resend failed:', error.response.data.errors);
                } else {
                    console.error('Unhandled resend email verification error:', error);
                    throw error;
                }
            });
    };    

    const logout = async () => {
        if (!error) {
            await customAxios.post('/api/logout').then(() => mutate());
        }

        window.location.pathname = '/login';
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated); // Redirect if already logged in
        }

        if (middleware === 'auth' && !user && error) {
            logout(); // Logout and redirect to login if session expired
        }

        if (middleware === 'auth' && user) {
            if (!user?.email_verified_at && window.location.pathname !== '/verify-email') {
                router.push('/verify-email'); // Redirect to email verification
            } else if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
                router.push(redirectIfAuthenticated || '/dashboard'); // Redirect to the dashboard
            }
        }
    }, [user, error]);

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