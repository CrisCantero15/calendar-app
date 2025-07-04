import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

// TODO: configurar interceptores
calendarApi.interceptors.request.use( config => { // Interceptor en la petición que añade el token en la cabecera

    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }

    return config;

});

export default calendarApi;