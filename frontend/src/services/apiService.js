const API_BASE_URL = 'http://localhost:4000/api';

let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

const request = async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
    }
    
    // For 204 No Content, response.json() will fail
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
};

// --- Auth Service ---
export const login = (email, password) => request('/auth/login', 'POST', { email, password });
export const register = (userData) => request('/auth/register', 'POST', userData);
export const getMe = () => request('/auth/me');

// --- Service Service ---
export const getAllServices = () => request('/services');
export const createService = (serviceData) => request('/services', 'POST', serviceData);
export const searchServices = (name) => request(`/services/search/${name}`);

// --- Relationship Service ---
export const offerService = (serviceName) => request('/relationships/offers', 'POST', { serviceName });
export const useService = (serviceName) => request('/relationships/uses', 'POST', { serviceName });
