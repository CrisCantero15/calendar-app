// Realizar interacciones con la parte del Auth de nuestro Store

import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {
    
    const dispatch = useDispatch();
    const { status, user, errorMessage } = useSelector( state => state.auth );

    const startLogin = async ({ email, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime()); // Marcamos la hora de creación del token (tiempo de expiración: 2 horas)
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => { // Manejamos con un setTimeout el estado del 'auth' para que desaparezca el mensaje de error y el status sea 'not-authenticated'
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async ({ name, email, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            dispatch( onLogout(error.response.data?.msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );
        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear(); // Borramos el token de autenticación del localStorage
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );
    }
    
    return {
        //* Propiedades
        status,
        user,
        errorMessage,

        //* Métodos
        checkAuthToken,
        startLogin,
        startRegister,
        startLogout
    }

}