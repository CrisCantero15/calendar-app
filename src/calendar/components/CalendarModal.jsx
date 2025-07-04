import { useEffect, useState } from "react";
import { useMemo } from "react";
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import Swal from "sweetalert2";
import { addHours, differenceInSeconds } from "date-fns";
import es from 'date-fns/locale/es';

import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { useCalendarStore, useUiStore } from "../../hooks";

registerLocale('es', es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root'); // Le indicamos al Modal dónde debe colocarse (root de la app, mirar el index.html)

export const CalendarModal = () => {
    
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [ formSubmitted, setFormSubmitted ] = useState( false ); // Para saber cuándo se ha intentado postear el formulario
    const [ formValues, setFormValues ] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 ),
    });

    const titleClass = useMemo(() => {
        if ( !formSubmitted ) return '';
        return ( formValues.title.length > 0 ) // En caso de que el usuario inserte un título válido, retorna ''. Si no es válido, retorna 'is-invalid'
        ? ''
        : 'is-invalid'
    }, [formValues.title, formSubmitted]);

    useEffect(() => {
      if( activeEvent !== null ){
        setFormValues({ ...activeEvent });
      }
    }, [ activeEvent ]);
    

    const onInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [ target.name ]: target.value
        });
    }

    const onDateChange = ( event, changing ) => { // Event --> Recibo la nueva fecha // Changing --> Ayuda a saber si actualizar el valor de 'start' o 'end'
        setFormValues({
            ...formValues,
            [ changing ]: event
        });
    }
    
    const onSubmit = async ( event ) => {
        event.preventDefault();
        setFormSubmitted( true );
        const difference = differenceInSeconds( formValues.end, formValues.start ); // Calcular la diferencia en segundos entre dos fechas
        if( isNaN( difference ) || difference <= 0 ){
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error');
            return;
        }
        if ( formValues.title <= 0 ) return;
        // console.log({ formValues });
        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted( false ); // Quitar errores del formulario
    }

    return (
        <Modal
            isOpen={ isDateModalOpen }
            onRequestClose={ closeDateModal } // Se llama la función closeModal cuando se cierra el Modal clicando fuera
            style={ customStyles }
            className="modal"
            overlayClassName="modal-fondo" // Aplica estilos CSS al fondo oscuro (u "overlay") que aparece detrás del Modal cuando este está abierto
            closeTimeoutMS={ 200 } // Controla el tiempo de espera antes de que el Modal se desmonte del DOM después de que el usuario solicite cerrarlo. Útil en transiciones o animaciones
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>
                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <div className="customDatePickerWidth">
                    <DatePicker
                        locale="es"
                        selected={ formValues.start }
                        onChange={ ( event ) => onDateChange( event, 'start' ) } 
                        className="form-control"
                        showTimeSelect // Permitir seleccionar la hora en el DatePicker
                        dateFormat="Pp" // Formato para que se muestre la hora en el label
                        timeCaption="Hora" // Cambia el String del cuadro de Time en el DatePicker a "Hora"
                    />
                    </div>
                </div>
                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <div className="customDatePickerWidth">
                    <DatePicker
                        locale="es"
                        minDate={ formValues.start } // Maneja que no se pueda seleccionar una fecha inferior a la fecha de inicio
                        selected={ formValues.end }
                        onChange={ ( event ) => onDateChange( event, 'end' ) } 
                        className="form-control"
                        showTimeSelect
                        dateFormat="Pp"
                        timeCaption="Hora"
                    />
                    </div>
                </div>
                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input 
                        type="text"
                        className={ `form-control ${ titleClass }` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>
                <div className="form-group mb-2">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>
                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    )
}
