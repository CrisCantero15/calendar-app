import { useEffect, useState } from 'react';

import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../";
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

export const CalendarPage = () => {
    
    const { user } = useAuthStore();
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

    const [ language, setLanguage ] = useState( true ); // Para controlar el lenguaje del calendario (true lo muestra en castellano, false en inglés)
    const [ lastView, setLastView ] = useState( localStorage.getItem('lastView') || 'week' ); // Para controlar el manejo de la vista (se muestra la última que se mostró antes de recargar la página)

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        
        const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid ); // Controla la excepción del backend a la hora de definir el UID

        const style = {
            backgroundColor: isMyEvent ? '#346CF7' : '#465660',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white'
        }
        return {
            style
        }
    }

    const onChangeLanguage = () => {
        setLanguage( ( current ) => !current );
    }

    const onDoubleClick = ( event ) => {
        // console.log({ doubleClick: event });
        openDateModal();
    }

    const onSelect = ( event ) => {
        // console.log({ click: event });
        setActiveEvent( event );
    }

    const onViewChanged = ( event ) => {
        localStorage.setItem('lastView', event);
    }

    useEffect(() => {
        startLoadingEvents();
    }, []);
    
    return (
        <>
            <Navbar onChangeLanguage={ onChangeLanguage }/>
            <Calendar
                culture={ language && 'es' }
                messages={ language && getMessagesES() } // getMessages --> Cambiar el String de los 'messages' del calendario
                localizer={ localizer }
                events={ events } // Permite un Array de elementos con los diferentes eventos del calendario y una serie de propiedades (title, notes, start, end, bgColor, user)
                defaultView={ lastView } // La vista que se muestra por defecto al recargar la página del calendario
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px )' }} // Lo calcula porque el navbar ocupa aprox. 80 px, entonces hay que restarle esa cantidad al vh
                eventPropGetter={ eventStyleGetter } // Función para asignar dinámicamente propiedades CSS o clases a un evento específico del calendario
                components={{ // Permite personalizar cómo se renderizan diferentes partes del calendario
                    event: CalendarEvent
                }}
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChanged } // Cuando cambie la vista del calendario se lanza este evento
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    )
}
