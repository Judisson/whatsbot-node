const dotenv = require('dotenv').config();
const pino = require('pino');
const Chat = require('../db/models/chat.model');
const axios = require('axios');
const config = require('../config/config');
const logger = require('pino')();

const receiveMessage = async (objChat) => {
  let { chatId, messages } = objChat;
  let message = messages[0].text.body;
  console.log('receiveMessage: ', messages);
  let objMessageGPT = {
    contact_number: messages[0].contact_number,
    text: message,
    type: messages[0].type,
  };

  let chat = await Chat.findOne({ chatId: chatId });

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

  sendMessageGPT(objMessageGPT);
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

const sendMessageGPT = async (objClientMessage) => {
  console.log('----------------------------------------------------------');
  console.log('\n');
  console.log('112(instance) - objClientMessage : ', objClientMessage);
  console.log('\n');
  console.log('----------------------------------------------------------');

  let { contact_number, text, type } = objClientMessage;
  let { data } = await axios
    .post(
      process.env.CHATGPT_SERVER_API_URL,
      {
        contact_number,
        question: text,
        type,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      let data = response.data;
      console.log('----------------------------------------------------------');
      console.log('\n');
      console.log('sendMessageGPT: ', data);
      console.log('\n');
      console.log('----------------------------------------------------------');
      return response;
    })
    .catch((err) => {
      console.error('Erro ao enviar mensagem para o ChatGPT:', err.data);
    });
  console.log('----------------------------------------------------------');
  console.log('\n');
  console.log('145(instance) - sendMessageGPT Data : ', data);
  console.log('\n');
  console.log('----------------------------------------------------------');
  return data;
};


const sendMessageClient = async (objMessageResponse) => {
  let { contact_number, response_question, type } = objMessageResponse;
  console.log('73(instance) - sendMessageClient', objMessageResponse);
  let { data } = await axios
    .post(
      process.env.WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: contact_number,
        type: type,
        text: {
          body: response_question,
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
      // if (!response.data.messages) {
      //   throw new Error('Mensagem não encontrada, por isso não enviada!');
      // }
      console.log('----------------------------------------------------------');
      console.log('\n');
      console.log('145(instance) - sendMessageClient : ', response.data);
      console.log('\n');
      console.log('----------------------------------------------------------');
      return response;
    })
    .catch((err) => {
      console.error("151(instance) - sendMessageClient error : ", err.data);
    });
  // console.log('----------------------------------------------------------');
  // console.log('\n');
  // console.log('155(instance) - sendMessageClient : ', data);
  // console.log('\n');
  // console.log('----------------------------------------------------------');
  return data;
};

module.exports = { receiveMessage, statusMessage, sendMessageClient };
