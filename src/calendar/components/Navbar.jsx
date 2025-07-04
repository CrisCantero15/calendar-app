import { useAuthStore } from "../../hooks"

export const Navbar = ({ onChangeLanguage }) => {
    
    const { startLogout, user } = useAuthStore();

    return (
        <div className="navbar navbar-dark bg-dark mb-4 px-4">
            <span className="navbar-brand">
                <i className="fas fa-calendar-alt"></i>
                &nbsp; {/* Separación entre icono y Fernando */}
                { user.name }
            </span>
            <button 
                className="btn btn-outline-primary"
                onClick={ onChangeLanguage }
            >
                Cambiar idioma
            </button>
            <button 
                className="btn btn-outline-danger"
                onClick={ startLogout }
            >
                <i className="fas fa-sign-out-alt"></i>
                &nbsp;
                <span>Salir</span>
            </button>
        </div>
    )
}
