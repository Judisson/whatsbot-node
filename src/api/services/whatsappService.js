// whatsappService.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.WHATSAPP_API_URL;
const TOKEN = process.env.WHATSAPP_TOKEN;

const sendMessage = async (to, message) => {
    try {
        const response = await axios.post(
            `${API_URL}/messages`, 
            {
                to: to,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
};

module.exports = { sendMessage };
