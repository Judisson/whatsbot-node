const dotenv = require('dotenv').config();
const pino = require('pino');
const Chat = require('../db/models/chat.model');
const axios = require('axios');
const config = require('../config/config');
const logger = require('pino')();

const receiveMessage = async (objChat) => {
  let { chatId, messages } = objChat;
  let message = messages[0].text.body;

  // console.log('messages', messages);

  let chat = await Chat.findOne({ chatId: chatId });

  // console.log('chatComplete', chat);

  if (!chat) {
    let newChat = new Chat({
      chatId: chatId,
      messages: messages,
    });

    newChat
      .save()
      .then((doc) => console.log('Documento salvo novo: '))
      .catch((err) => console.log('Erro ao salvlar o novo documento: ', err));
  } else {
    chat.messages.push(...messages);

    chat
      .save()
      .then((doc) => console.log('Documento salvo '))
      .catch((err) =>
        console.error('Erro ao salvar o documento existente: ', err)
      );
  }

  sendMessageGPT(message);
};

const statusMessage = async (objStatus) => {
  Chat.findOne({ chatId: objStatus.chatId })
    .then((chat) => {
      if (!chat) {
        throw new Error('Chat não encontrado');
      }

      let message = chat.messages.find(
        (message) => message.messageId === objStatus.statuses[0].messageId
      );

      if (!message) {
        throw new Error('Mensagem do Status não encontrada');
      }

      message.statuses.push(...objStatus.statuses);

      return chat.save();
    })
    .then((stats) => console.log('Status salvo'))
    .catch((err) => console.log(err));
};

const sendMessageClient = async (message, to, typeMessage) => {
  console.log('sendMessageClient', message);
  return axios
    .post(
      process.env.WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: '5561996985714',
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

const sendMessageGPT = async (message) => {
  return axios
    .post(
      process.env.CHATGPT_SERVER_API_URL,
      {
        question: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error('Erro ao enviar mensagem:', err);
    });
};

module.exports = { receiveMessage, statusMessage, sendMessageClient };

// body: {
//   messaging_product: 'whatsapp',
//   to: '5561996985714',
//   type: 'text',
//   text: {
//     body: message,
//   },
// },
