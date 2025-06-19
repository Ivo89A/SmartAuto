import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

function enviarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
        alert('Por favor completa todos los campos.');
        return;
    }

    // Enviar datos al webhook/backend
    fetch('https://n8n-production-5982.up.railway.app/webhook/lead-lost-webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
    })
    .then((res) => {
        if (res.ok) {
            alert(`Gracias ${nombre}, tu mensaje ha sido recibido. Te responderemos pronto.`);
            event.target.reset();
        } else {
            alert('Error al enviar el mensaje. Intentalo de nuevo.');
        }
    })
    .catch(() => {
        alert('No se pudo enviar el mensaje. Verifica tu conexión o intenta más tarde.');
    });
}
