import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

// Encargado de manejar las interacciones con el store en calendarSlice

export const useCalendarStore = () => {

    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingEvent = async ( calendarEvent ) => {
        try {
            if( calendarEvent.id ) { // Recuerda que el calendarEvent si tiene ID es porque es un evento ya creado. Si no tiene ID, es porque es un nuevo evento
                // Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent);
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            }
            // Creando
            const { data } = await calendarApi.post('/events', calendarEvent); // Cargamos el evento en el backend
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) ); // Actualizamos el store con el nuevo event
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    }

    const startDeletingEvent = async () => {
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`);
            dispatch( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }
    }

    const startLoadingEvents = async () => { // Carga de los eventos del backend
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.msg ); // Las fechas en el backend vienen en formato String, por lo que necesitamos parsearlas a tipo Date
            dispatch( onLoadEvents( events ) );
        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent, // Si tiene un objeto, regresa true, sino regresa false

        //* Métodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }

}