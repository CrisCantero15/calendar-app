import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store";

// Encargado de manejar las interacciones con el store en uiSlice

export const useUiStore = () => {

    const dispatch = useDispatch();

    const { 
        isDateModalOpen
    } = useSelector( state => state.ui );

    const openDateModal = () => { // Función para abrir el Modal
        dispatch( onOpenDateModal() );
    }

    const closeDateModal = () => { // Función para cerrar el Modal
        dispatch( onCloseDateModal() );
    }

    const toggleDateModal = () => { // Toggle para abrir/cerrar el Modal
        ( isDateModalOpen )
        ? openDateModal()
        : closeDateModal();
    }

    return {
        //* Propiedades
        isDateModalOpen,

        //* Métodos
        openDateModal,
        closeDateModal,
        toggleDateModal
    }

}