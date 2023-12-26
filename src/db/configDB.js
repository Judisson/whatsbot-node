

// Enable or disable mongodb
const MONGODB_ENABLED = !!(
  process.env.MONGODB_ENABLED && process.env.MONGODB_ENABLED === "true"
);

//verificar depois a rota do banco o nome deve ser talve whatschat e naõ whatasinstance
const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/WhatsAppInstance";


  module.exports = {
    moongoose: {
      enabled: MONGODB_ENABLED,
      url: MONGODB_URL,
    },
  }