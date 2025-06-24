import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';



//Envio de datos a Supabase


// app.js
const supabase = supabase.createClient('https://xpgaxmooupfgmtkfzciu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZ2F4bW9vdXBmZ210a2Z6Y2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODAwMzgsImV4cCI6MjA2NjM1NjAzOH0.2juPb6KxNZv4nV03Pkl8Q4mnpYWveH4CPGNXr2YVcBs');

async function enviarFormulario(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const mensaje = document.getElementById('mensaje').value;

  const { error } = await supabase.from('contactos').insert([{ nombre, correo, mensaje }]);

  if (error) {
    alert('Hubo un error al enviar.');
    console.error(error);
  } else {
    alert('¡Mensaje enviado con éxito!');
  }
}


  guardarContacto();

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

