import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

// const tempEvent = {
//     _id: new Date().getTime(), // ID único de la nota
//     title: 'Cumpleaños del Jefe',
//     notes: 'Hay que comprar el pastel',
//     start: new Date(), // Momento en el que empieza el evento (new Date() = momento actual)
//     end: addHours( new Date(), 2 ), // Momento en el que termina el evento. Con addHours tomamos una fecha y podemos sumarle X cantidad de tiempo (2 horas en nuestro caso)
//     bgColor: '#fafafa',
//     user: { // Usuario que crea el evento
//         _id: '123',
//         name: 'Fernando'
//     }
// };

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [ // Eventos del Calendar
            
        ], 
        activeEvent: null // Evento activo en ese momento del Calendar
    },
    reducers: {
        onSetActiveEvent: ( state, { payload } ) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: ( state, { payload } ) => {
            state.events.push( payload );
            state.activeEvent = null; // Una vez que se cierre el Modal, ya no hay nota activa, simplemente se crea el evento
        },
        onUpdateEvent: ( state, { payload } ) => { // Si estoy actualizando un evento, es porque ya tiene con un ID
            state.events = state.events.map( event => {
                if( event.id === payload.id ) {
                    return payload;
                }
                state.activeEvent = null;
                return event;
            });
        },
        onDeleteEvent: ( state ) => {
            if ( state.activeEvent ) {
                state.events = state.events.filter( event => event.id !== state.activeEvent.id );
                state.activeEvent = null;
            }
        },
        onLoadEvents: ( state, { payload = [] } ) => {
            state.isLoadingEvents = false;
            // state.events = payload;
            payload.forEach( event => {
                const exists = state.events.some( dbEvent => dbEvent.id === event.id );
                if ( !exists ) {
                    state.events.push( event );
                }
            });
        },
        onLogoutCalendar: ( state ) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = null
        }
    }
});


// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar } = calendarSlice.actions;