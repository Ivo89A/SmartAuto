  async function enviarFormulario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    try {
      const res = await fetch('https://n8n-production-5982.up.railway.app/webhook/lead-lost-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, mensaje })
      });

      if (res.ok) {
        alert('¡Mensaje enviado correctamente!');
        event.target.reset();
      } else {
        alert('Error al enviar. Intenta más tarde.');
      }
    } catch (error) {
      console.error(error);
      alert('No se pudo conectar con el servidor.');
    }
  }