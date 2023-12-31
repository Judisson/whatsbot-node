const { receiveMessage, statusMessage, sendMessageClient } = require('../class/instance')
const Chat = require('../db/models/chat.model');

exports.Receive = async (req, res) => {
    const data = await receiveMessage(
        req.body || []
    )
    return res.status(200).json({ data: data })
}

exports.Status = async (req, res) => {
    const data = await statusMessage(
        req.body || []
    )
    return res.status(200).json({ data: data })
}

exports.Response = async (req, res) => {
    const data = await sendMessageClient(
        req.body.resposta
    )
    console.log("Data que vem do ServidorGPT: ", data)
    return res.status(200).json(data)
}