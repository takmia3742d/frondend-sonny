import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ListaConversaciones from '../components/mensajes/ListaConversaciones';
import ChatWindow from '../components/mensajes/ChatWindow';
import '../styles/mensajes.css';

function MensajesPage() {
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    return (
        <div className="mensajes-page">
            <Navbar />

            <div className="mensajes-container">
                <Sidebar />

                <div className="mensajes-contenido">
                    <ListaConversaciones
                        onSeleccionarUsuario={setUsuarioSeleccionado}
                        usuarioSeleccionado={usuarioSeleccionado}
                    />
                    <ChatWindow usuarioSeleccionado={usuarioSeleccionado} />
                </div>
            </div>
        </div>
    );
}

export default MensajesPage;