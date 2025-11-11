
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqscwllxgmlqxpwyiywh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Función para togglear el panel de leads
function toggleLeadsPanel() {
  const panel = document.getElementById('leads');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  if (panel.style.display === 'block') {
    cargarLeads();  // Carga leads al abrir
  }
}

// Create + Webhook: Envía al webhook de n8n Y a Supabase
async function enviarFormulario(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();  // Corregido de 'correo'
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    // 1. Envío al webhook de n8n (sin cambios)
    const webhookRes = await fetch('https://osvaldo.n8n.metodovidroop.com/webhook/12a7a445-7f1e-48e4-b32b-77236556ff45', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, mensaje })  // Corregido de 'correo'
    });

    // 2. Insertar en Supabase (Create)
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nombre, email, mensaje, estado: 'nuevo' }]);

    if (webhookRes.ok && !error) {
      alert('¡Lead enviado correctamente y guardado!');
      event.target.reset();
      if (document.getElementById('leads').style.display === 'block') {
        cargarLeads();  // Recarga la tabla
      }
    } else {
      throw new Error('Error en Supabase o webhook');
    }
  } catch (error) {
    console.error(error);
    alert('Error al enviar. Intenta más tarde.');
  }
}


function emailJs() {
  const formEl = document.querySelector('.contact-form');
  
  formEl.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  const request = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    mensaje: document.getElementById('mensaje').value,
  };

  var serviceID = 'service_06fkpxv';
  var templateID = 'template_g3oj3vg';

  try {
    emailjs.send(serviceID, templateID, request)
      .then(() => {
        console.log('Gracias por contactarnos!');
      }, (err) => {
        console.log('FAILED...', err);
      });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }

}
emailJs();


// Cargar y mostrar todos los leads en una tabla
async function cargarLeads() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tableContainer = document.getElementById('leads-table');
    if (!leads || leads.length === 0) {
      tableContainer.innerHTML = '<p>No hay leads disponibles.</p>';
      return;
    }

    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Mensaje</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    leads.forEach(lead => {
      tableHTML += `
        <tr>
          <td>${lead.id.substring(0, 8)}...</td>
          <td>${lead.nombre}</td>
          <td>${lead.email}</td>
          <td>${lead.mensaje.substring(0, 50)}...</td>
          <td>
            <select onchange="actualizarEstado('${lead.id}', this.value)">
              <option ${lead.estado === 'nuevo' ? 'selected' : ''}>nuevo</option>
              <option ${lead.estado === 'contactado' ? 'selected' : ''}>contactado</option>
              <option ${lead.estado === 'cerrado' ? 'selected' : ''}>cerrado</option>
            </select>
          </td>
          <td>${new Date(lead.created_at).toLocaleDateString('es-ES')}</td>
          <td>
            <button onclick="eliminarLead('${lead.id}')">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
  } catch (error) {
    console.error(error);
    document.getElementById('leads-table').innerHTML = '<p>Error al cargar leads.</p>';
  }
}

// Actualizar estado de un lead
async function actualizarEstado(id, nuevoEstado) {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) throw error;
    alert('Estado actualizado!');
    cargarLeads();  // Recarga tabla
  } catch (error) {
    console.error(error);
    alert('Error al actualizar.');
  }
}

// Eliminar un lead
async function eliminarLead(id) {
  if (!confirm('¿Seguro que quieres eliminar este lead?')) return;

  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    alert('Lead eliminado!');
    cargarLeads();  // Recarga tabla
  } catch (error) {
    console.error(error);
    alert('Error al eliminar.');
  }
}
