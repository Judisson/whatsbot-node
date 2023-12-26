const dotenv = require("dotenv").config();
const connectMongoDB = require("./db/mongoDB");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3332;

const Chat = require("./db/models/chat.model");

connectMongoDB();

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
  // .then((doc) => console.log("Documento salvo:", doc))
  // .catch((err) => console.error("Erro ao salvar o documento:", err));

app.use(express.json());

app.post("/mensagens-recebidas-data", async (req, res) => {
  console.log("Dados recebidos: ");
  const formattedJson = JSON.stringify(req.body, null, 2);
  console.log(formattedJson);
  console.log("\n");
  console.log(
    "--------------------------------------------------------------------------------------"
  );
  console.log("\n");
  // Aqui você vai tratar os dados recebidos e depois armazená-los no banco de dados

  try {
    const entries = req.body.entry || [];

    await Promise.all(
      entries.map(async (entry) => {
        const idNumberMe = entry.changes[0].value.metadata.phone_number_id;
        const contacts = entry.changes[0].value.contacts;
        // console.log("contato: \n", contacts);
        const messages = entry.changes[0].value.messages;
        // .map(message => {
        //   let newMessage = {...message}; // Cria uma cópia do objeto message
        //   // newMessage.externalId = newMessage.id; // Renomeia 'id' para 'externalId'
        //   delete newMessage.id; // Remove o campo 'id' original
        //   return newMessage;
        // });

        // messages2 = messages.map(message => {
        //   let newMessage = {...message}; // Cria uma cópia do objeto message
        //   // newMessage.externalId = newMessage.id; // Renomeia 'id' para 'externalId'
        //   delete newMessage.id; // Remove o campo 'id' original
        //   return newMessage;
        // });
        // console.log("mensagens: ", messages2.map((message) => ({
        //   message
        // })));
        console.log("mensagem: ", messages);
        console.log("mensagem test: \n");

        contacts.map(async (contact) => {
          const idNumberClient = contact.wa_id;
          const chatId = `${idNumberMe}_${idNumberClient}`;

          let chat = await Chat.findOne({ chatId: chatId });

          if (!chat) {
            let newChat = new Chat({
              chatId,
              messages: messages,
              // messages: messages.map((message) => ({
              //   // messageId: message.id,
              //   from: message.from,
              //   to: message.to,
              //   timestamp: message.timestamp || new Date(),
              //   body: message.body,
              //   type: message.type,
              //   contact_name: message.contact_name,
              //   contact_number: message.contact_number,
              // //   statuses: message.statuses ? message.statuses.map(status => ({
              // //     idStatus: status.idStatus,
              // //     status: status.status,
              // //     timestamp: status.timestamp || new Date(), // Adiciona a data e hora atual se timestamp não for fornecido
              // //     toNumber: status.toNumber
              // // })) : [],
              // fields: message.fields
              // })),
            });
            console.log("vai Puxar a mensagem");
            // newChat.messages.push(messages);

            console.log('newChat', newChat)
            await newChat.save().then((doc) => console.log("Documento salvo novo: ", doc))
            .catch((err) => console.error("Erro ao salvar o documento:", err));
          } else {
            chat.messages.push(...messages);

            await chat.save().then((doc) => console.log("Documento salvo : ", doc))
            .catch((err) => console.error("Erro ao salvar o documento existente: ", err));
          }

          // if (chat) {

          // }
        });

        // messages.map(async (message) => {
        //   const idNumberClient = message.from;
        // });
      })
    );

    res.status(200).send("Dados recebidos com sucesso!");
  } catch (error) {
    console.log("Erro ao inserir os dados", error);
  }
  // res.status(200).send('U | Dados recebidos com sucesso!');
});

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// process.on("uncaughtException", (err) => {
//   console.error("Exceção não capturada:", err);
//   // Implemente a lógica que você achar necessária aqui
// });

app.listen(PORT, () => {
  // console.log(`Servidor rodando na porta ${PORT}`);
});
