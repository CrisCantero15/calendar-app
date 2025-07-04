// Función para parsear las fechas de tipo String a tipo Date

import { parseISO } from "date-fns";

export const convertEventsToDateEvents = ( events = [] ) => {

    return events.map( event => {

        event.start = parseISO( event.start ); // parseISO de date-fns permite convertir una fecha en formato ISO 8601 (string) en una instancia de Date de JavaScript.
        event.end = parseISO( event.end );

        return event;

    });

}