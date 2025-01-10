import Axios from 'axios';

// Create a custom Axios instance
const customAxios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Backend URL from environment variables
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // Ensure requests are marked as AJAX
    },
    withCredentials: true, // Include credentials (cookies) in requests
});

// Automatically include CSRF token from cookies in headers
customAxios.interceptors.request.use((config) => {
    // Retrieve CSRF token from cookies
    const xsrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }

    return config;
});

export default customAxios;

