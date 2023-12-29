const { receiveMessage } = require('../class/instance')
const Chat = require('../db/models/chat.model');

exports.Receive = async (req, res) => {
    const data = await receiveMessage(
        req.body.entry || []
    )
    return res.status(200).json({ data: data})
}