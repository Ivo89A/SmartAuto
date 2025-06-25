import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://xpgaxmooupfgmtkfzciu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZ2F4bW9vdXBmZ210a2Z6Y2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODAwMzgsImV4cCI6MjA2NjM1NjAzOH0.2juPb6KxNZv4nV03Pkl8Q4mnpYWveH4CPGNXr2YVcBs'
);

async function enviarFormulario(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // 1. Guardar en Supabase
  const { error } = await supabase
    .from('contactos')
    .insert([{ nombre, correo, mensaje }]);

  if (error) {
    alert('Hubo un error al guardar en Supabase.');
    console.error(error);
    return;
  }

  // 2. Enviar a n8n
  try {
    const response = await fetch('https://n8n-production-5982.up.railway.app/webhook/lead-lost-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, correo, mensaje }),
    });

    if (response.ok) {
      alert(`Gracias ${nombre}, tu mensaje ha sido recibido. Te responderemos pronto.`);
      event.target.reset();
    } else {
      alert('Error al enviar los datos a n8n.');
    }
  } catch (err) {
    console.error(err);
    alert('No se pudo conectar con el servidor de automatización.');
  }
}

// Asegurate de tener un <form onsubmit="enviarFormulario(event)"> en tu HTML