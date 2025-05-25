
	import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

	

    /**createChat({
	webhookUrl: '',
	webhookConfig: {
		method: 'POST',
		headers: {}
	},
	target: '#n8n-chat',
	mode: 'window',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [
		'Hi there! 👋',
		'My name is Nathan. How can I assist you today?'
	],
	i18n: {
		en: {
			title: 'Hi there! 👋',
			subtitle: "Start a chat. We're here to help you 24/7.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},
});*/

function enviarFormulario(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    if (!nombre || !email || !mensaje) {
        alert('Por favor completa todos los campos.');
        return;
    }
    // Simulamos envio
    alert(`Gracias ${nombre}, tu mensaje ha sido recibido. Te responderemos pronto.`);
    event.target.reset();
}