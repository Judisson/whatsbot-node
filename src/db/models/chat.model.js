const mongoose = require('mongoose');

statusSchema = new mongoose.Schema({
  messageId: String,
  status: String,
  timestamp: Date,
  toNumber: Number,
  conversation: {
    id: String,
    expiration_timestamp: String,
    origin: {
      type: { type: String},
    },
  },
  pricing: {
    billable: Boolean,
    pricing_model: String,
    category: String,
  },
});

const messageSchema = new mongoose.Schema({
  messageId: String, //id dentro de messages.message
  from: String,
  to: String,
  timestamp: Date,
  text: { body: String },
  type: String,
  contact_name: String, //name
  contact_number: String, //wa_id
  statuses: [statusSchema],
  fields: String,
});

const chatSchema = new mongoose.Schema({
  chatId: String,
  messages: [messageSchema],
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;
