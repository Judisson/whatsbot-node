const dotenv = require('dotenv').config();
const pino = require('pino');
const Chat = require('../db/models/chat.model');
const axios = require('axios');
const config = require('../config/config');
const logger = require('pino')();

// class WhatsAppInstance {
//   async receiveMessage (data) {
//     //teste
//   }
// }

const receiveMessage = async (objChat) => {
  let { chatId, messages } = objChat;
  let message = messages[0].text.body

  // console.log('messages', messages);

  let chat = await Chat.findOne({ chatId: chatId });

  // console.log('chatComplete', chat);

  if (!chat) {
    let newChat = new Chat({
      chatId: chatId,
      messages: messages,
    });

    await newChat
      .save()
      .then((doc) => console.log('Documento salvo novo: '))
      .catch((err) => console.log('Erro ao salvlar o novo documento: ', err));
  } else {
    chat.messages.push(...messages);

    await chat
      .save()
      .then((doc) => console.log('Documento salvo '))
      .catch((err) =>
        console.error('Erro ao salvar o documento existente: ', err)
      );
  }

  sendMessageGPT(message)

  // console.log("Dados recebidos: ");
  // const formattedJson = JSON.stringify(chat, null, 2);
  // console.log('json formater: \n',formattedJson);
  // console.log("\n");
  // console.log(
  //   "--------------------------------------------------------------------------------------"
  // );
  // console.log("\n");

  // Aqui você vai tratar os dados recebidos e depois armazená-los no banco de dados

  // try {
  //   const entries = req.body.entry || [];

  //   await Promise.all(
  //     entries.map(async (entry) => {
  //       const idNumberMe = entry.changes[0]?.value?.metadata?.phone_number_id;
  //       const contacts = entry.changes[0].value.contacts;
  //       const contact_name =
  //         contacts && contacts.length > 0
  //           ? entry.changes[0].value.contacts[0].profile?.name || "Sem nome"
  //           : "Sem Nome";
  //       console.log("contact_name", contact_name);
  //       const contact_number =
  //         contacts && contacts.length > 0
  //           ? entry.changes[0].value.contacts[0]?.wa_id || "Sem número Definido"
  //           : undefined;
  //       // console.log("contato: \n", contacts);
  //       const messages = entry.changes[0].value.messages?.map((message) => {
  //         let newMessage = { ...message }; // Cria uma cópia do objeto message
  //         newMessage.messageId = newMessage.id;
  //         newMessage.contact_number = contact_number;
  //         // newMessage.contact_name = contact_name; // Renomeia 'id' para 'externalId'
  //         delete newMessage.id; // Remove o campo 'id' original
  //         return newMessage;
  //       });

  //       if (contacts) {
  //         contacts.map(async (contact) => {
  //           const idNumberClient = contact.wa_id;
  //           const chatId = `${idNumberMe}_${idNumberClient}`;

  //           let chat = await Chat.findOne({ chatId: chatId });

  //           if (!chat) {
  //             let newChat = new Chat({
  //               chatId,
  //               messages: messages,
  //               // messages: messages.map((message) => ({
  //               //   // messageId: message.id,
  //               //   from: message.from,
  //               //   to: message.to,
  //               //   timestamp: message.timestamp || new Date(),
  //               //   body: message.body,
  //               //   type: message.type,
  //               //   contact_name: message.contact_name,
  //               //   contact_number: message.contact_number,
  //               // //   statuses: message.statuses ? message.statuses.map(status => ({
  //               // //     idStatus: status.idStatus,
  //               // //     status: status.status,
  //               // //     timestamp: status.timestamp || new Date(), // Adiciona a data e hora atual se timestamp não for fornecido
  //               // //     toNumber: status.toNumber
  //               // // })) : [],
  //               // fields: message.fields
  //               // })),
  //             });
  //             // console.log("vai Puxar a mensagem");
  //             // newChat.messages.push(messages);

  //             console.log("newChat", newChat);
  //             await newChat
  //               .save()
  //               .then((doc) => console.log("Documento salvo novo: ", doc))
  //               .catch((err) =>
  //                 console.error("Erro ao salvar o documento:", err)
  //               );
  //           } else {
  //             console.log("chat antigos");
  //             chat.messages.push(...messages);

  //             await chat
  //               .save()
  //               .then((doc) => console.log("Documento salvo : ", doc))
  //               .catch((err) =>
  //                 console.error("Erro ao salvar o documento existente: ", err)
  //               );
  //           }

  //           // if (chat) {

  //           // }
  //         });
  //       } else {
  //         const messages_me = entry.changes[0].value.message_echoes;

  //         messages_me.map(async (message) => {
  //           const idNumberClient = message.to;
  //           const chatId = `${idNumberMe}_${idNumberClient}`;

  //           let chat = await Chat.findOne({ chatId: chatId });

  //           if (!chat) {
  //             let newChat = new Chat({
  //               chatId,
  //               messages: messages_me,
  //             });

  //             console.log("newChat me", newChat);
  //             await newChat
  //               .save()
  //               .then((doc) => console.log("Documento salvo novo: ", doc))
  //               .catch((err) =>
  //                 console.error("Erro ao salvar o documento:", err)
  //               );
  //           } else {
  //             console.log("chat antigos me");
  //             chat.messages.push(...messages_me);

  //             await chat
  //               .save()
  //               .then((doc) => console.log("Documento salvo : ", doc))
  //               .catch((err) =>
  //                 console.error("Erro ao salvar o documento existente: ", err)
  //               );
  //           }
  //         });
  //       }
  //     })
  //   );

  //   res.status(200).send("Dados recebidos com sucesso!");
  // } catch (error) {
  //   console.log("Erro ao inserir os dados", error);
  // }
};

const statusMessage = async (objStatus) => {
  // let chat = await Chat.findOne({ chatId: objStatus.chatId });
  // console.log("chat: ", Chat)
  // console.log("\n");
  // console.log(
  //   "--------------------------------------------------------------------------------------"
  // );

  // console.log('objStatus: ', objStatus);
  // console.log('\n');
  // console.log(
  //   '--------------------------------------------------------------------------------------'
  // );
  Chat.findOne({ chatId: objStatus.chatId })
    .then((chat) => {
      if (!chat) {
        throw new Error('Chat não encontrado');
      }
      // console.log('chat', chat.messages);
      // console.log('conversation: ', objStatus.statuses[0].conversation);
      // let message1 = chat.messages

      // console.log('chatMessage', message1)

      let message = chat.messages.find(
        (message) => message.messageId === objStatus.statuses[0].messageId
      );
      if (!message) {
        throw new Error('Mensagem não encontrada ao salvar o Status');
      }
      console.log('message: ', message.statuses[0].conversation);
      message.statuses.push(...objStatus.statuses);

      return chat.save();
    })
    .then((stats) => console.log('Status salvo'))
    .catch((err) => console.log(err));

  // console.log("messageStatus",message)
  // message.then()
};

const sendMessageClient = async (message) => {
  console.log("sendMessageClient", message)
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
      console.log('----------------------------------------------------------');
      console.log('\n');
      console.log('Resposta do chatGPT: ', response.data);
      console.log('\n');
      console.log('----------------------------------------------------------');
      return response.data;
    })
    .catch((err) => {
      console.error('Erro ao enviar mensagem');
    });
  // console.log('Mensagem enviada:', response.data);

  // return response;
};

const sendMessageGPT = async (message) => {
  return axios
    .post(
      process.env.CHATGPT_SERVER_API_URL,
      {
        question: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      console.log('----------------------------------------------------------');
      console.log('\n');
      console.log('Resposta do chatGPT: ', response);
      console.log('\n');
      console.log('----------------------------------------------------------');
      // sendMessage(response)
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
