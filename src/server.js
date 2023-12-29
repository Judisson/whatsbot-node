const dotenv = require("dotenv").config();
const connectMongoDB = require("./db/mongoDB");
const express = require("express");
const app = require("./config/express");
const PORT = process.env.PORT || 3332;

// const testMessage = true;

//---------------------------------------------------------------------------------
//Mensagem teste

// async function handleTestChat(testMessage) {
//   let testeDMessage = testMessage;
//   console.log("entrou na função");
//   if (testMessage) {
//     console.log("Entrou no if", testeDMessage); 
//     let chatId = "190598850804966_556196985714";
//     let chat = await Chat.findOne({ chatId: chatId });

//     console.log("char se existerrrr", chat);

//     const chatTesteMe = new Chat({
//       messages: [
//         {
//           messageId: "messageId",
//           from: "15550636210",
//           to: "5561996985714",
//           timestamp: new Date(),
//           text: {
//             body: "Olá, mundo!1",
//           },
//           type: "text",
//           contact_name: "João",
//           contact_number: "5561996985714",
//           fields: "algum campo",
//         },
//       ],
//     });

//     console.log("ChattesteMe: ", chatTesteMe.messages );

//     if (!chat) {
//       console.log("entrando no chat novo");
//       let newChat = new Chat({
//         chatId,
//         messages: chatTesteMe.messages,
//         // messages: messages.map((message) => ({
//         //   // messageId: message.id,
//         //   from: message.from,
//         //   to: message.to,
//         //   timestamp: message.timestamp || new Date(),
//         //   body: message.body,
//         //   type: message.type,
//         //   contact_name: message.contact_name,
//         //   contact_number: message.contact_number,
//         // //   statuses: message.statuses ? message.statuses.map(status => ({
//         // //     idStatus: status.idStatus,
//         // //     status: status.status,
//         // //     timestamp: status.timestamp || new Date(), // Adiciona a data e hora atual se timestamp não for fornecido
//         // //     toNumber: status.toNumber
//         // // })) : [],
//         // fields: message.fields
//         // })),
//       });
//       // console.log("vai Puxar a mensagem");
//       // newChat.messages.push(messages);

//       // console.log("newChat", newChat); 
//       await newChat
//         .save()
//         .then((doc) => console.log("Documento salvo novo: ", doc)) 
//         .catch((err) => console.error("Erro ao salvar o documento:", err));
//     } else {
//       // console.log("chat antigos");
        
//       console.log("entrando no chat existente ", chat );     
//       chat.messages.push(...chatTesteMe.messages);

//       await chat
//         .save()
//         .then((doc) => console.log("Documento salvo:", doc))
//         .catch((err) => console.error("Erro ao salvar o documento:", err));
//     }
//   }
// }
// async function iniciarAplicacao() {
//   try {
//     await connectMongoDB();
//     handleTestChat(testMessage).then(() => console.log("Processo de Chat teste Concluiído")).catch((err) => console.error("Erro ao fazer o chat teste: ", err));
//   } catch (err) {
//     console.error("Erro");
//   }
// }

connectMongoDB();

// iniciarAplicacao();

//---------------------------------------------------------------------------------

// const chatTeste = new Chat({
//   chatId: "chat12345",
//   messages: [
//     {
//       messageId: "msg123",
//       from: "5561987654321",
//       to: "5561987654322",
//       timestamp: new Date(),
//       body: "Olá, mundo!",
//       type: "text",
//       contact_name: "João",
//       contact_number: "5561987654321",
//       statuses: [
//         {
//           idStatus: "status123",
//           status: "Enviado",
//           timestamp: new Date(),
//           toNumber: "5561987654322",
//         },
//       ],
//       fields: "algum campo",
//     },
//   ],
// });

// chatTeste
//   .save()
//   .then((doc) => console.log("Documento salvo:", doc))
//   .catch((err) => console.error("Erro ao salvar o documento:", err));

app.use(express.json());

// process.on("uncaughtException", (err) => {
//   console.error("Exceção não capturada:", err);
//   // Implemente a lógica que você achar necessária aqui
// });

app.listen(PORT, () => {
  // console.log(`Servidor rodando na porta ${PORT}`);
});

// module.exports = handleTestChat;