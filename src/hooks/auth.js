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
    
    // const csrf = () => customAxios.get('/sanctum/csrf-cookie');
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
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) {
                    throw error;
                } else {
                    setErrors(error.response.data.errors);
                }
            });
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        // await csrf();

        // setErrors([]);
        // setStatus(null);

        // customAxios
        //     .post('/login', props)
        //     .then(() => mutate())
        //     .catch(error => {
        //         if (error.response.status !== 422) {
        //             throw error;
        //         } else {
        //             setErrors(error.response.data.errors);
        //         }
        //     });
        customAxios.get('/sanctum/csrf-cookie').then(() => {
            api.post('/login', {
              email: 'user@example.com',
              password: 'password',
            }).then(response => {
              console.log('Logged in!', response.data);
            }).catch(error => {
              console.error('Login failed:', error.response);
            });
        }).then(res => {
            console.log('Logged in!', res.data);
        }).catch(err => {
            console.log('Logged in!', err.response);
        });
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        customAxios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) {
                    throw error;
                } else {
                    setErrors(error.response.data.errors);
                }
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
                if (error.response.status !== 422) {
                    throw error;
                } else {
                    setErrors(error.response.data.errors);
                }
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        customAxios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status));
    }

    const logout = async () => {
        if (!error) {
            await customAxios.post('/logout').then(() => mutate());
        }

        window.location.pathname = '/login';
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }

        if (middleware === 'auth' && !user?.email_verified_at) {
            router.push('/verify-email');
        }
        
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ) {
            router.push(redirectIfAuthenticated);
        }
        if (middleware === 'auth' && error) { logout(); }
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