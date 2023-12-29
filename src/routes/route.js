const express = require('express')
const router = express.Router();
const Chat = require("../db/models/chat.model");

router.post("/mensagens-recebidas-data", async (req, res) => {
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
        const idNumberMe = entry.changes[0]?.value?.metadata?.phone_number_id;
        const contacts = entry.changes[0].value.contacts;
        const contact_name =
          contacts && contacts.length > 0
            ? entry.changes[0].value.contacts[0].profile?.name || "Sem nome"
            : "Sem Nome";
        console.log("contact_name", contact_name);
        const contact_number =
          contacts && contacts.length > 0
            ? entry.changes[0].value.contacts[0]?.wa_id || "Sem número Definido"
            : undefined;
        // console.log("contato: \n", contacts);
        const messages = entry.changes[0].value.messages?.map((message) => {
          let newMessage = { ...message }; // Cria uma cópia do objeto message
          newMessage.messageId = newMessage.id;
          newMessage.contact_number = contact_number;
          // newMessage.contact_name = contact_name; // Renomeia 'id' para 'externalId'
          delete newMessage.id; // Remove o campo 'id' original
          return newMessage;
        });

        if (contacts) {
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
              // console.log("vai Puxar a mensagem");
              // newChat.messages.push(messages);

              console.log("newChat", newChat);
              await newChat
                .save()
                .then((doc) => console.log("Documento salvo novo: ", doc))
                .catch((err) =>
                  console.error("Erro ao salvar o documento:", err)
                );
            } else {
              console.log("chat antigos");
              chat.messages.push(...messages);

              await chat
                .save()
                .then((doc) => console.log("Documento salvo : ", doc))
                .catch((err) =>
                  console.error("Erro ao salvar o documento existente: ", err)
                );
            }

            // if (chat) {

            // }
          });
        } else {
          const messages_me = entry.changes[0].value.message_echoes;

          messages_me.map(async (message) => {
            const idNumberClient = message.to;
            const chatId = `${idNumberMe}_${idNumberClient}`;

            let chat = await Chat.findOne({ chatId: chatId });

            if (!chat) {
              let newChat = new Chat({
                chatId,
                messages: messages_me,
              });

              console.log("newChat me", newChat);
              await newChat
                .save()
                .then((doc) => console.log("Documento salvo novo: ", doc))
                .catch((err) =>
                  console.error("Erro ao salvar o documento:", err)
                );
            } else {
              console.log("chat antigos me");
              chat.messages.push(...messages_me);

              await chat
                .save()
                .then((doc) => console.log("Documento salvo : ", doc))
                .catch((err) =>
                  console.error("Erro ao salvar o documento existente: ", err)
                );
            }
          });
        }
      })
    );

    res.status(200).send("Dados recebidos com sucesso!");
  } catch (error) {
    console.log("Erro ao inserir os dados", error);
  }
  // res.status(200).send('U | Dados recebidos com sucesso!');
});

router.post("/message-status")

router.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

module.exports = router;
