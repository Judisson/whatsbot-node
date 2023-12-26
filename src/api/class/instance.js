const pino = require('pino')
const Chat = require('../models/chat.model')
const axios = require('axios')
const config = require('../../config/config')
const logger = require('pino')()


const sendMessage = async (message) => {
  try {
    const response = await axios.post(process.env.WHATSAPP_API_URL, {
      // Estrutura do corpo da mensagem conforme a API do WhatsApp exige
      // Por exemplo:
      // to: 'destinatario',
      // type: 'text',
      // text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Mensagem enviada:', response.data);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};