const express = require('express');
const router = express.Router();
const messageRoutes = require('./message.route')
const Chat = require('../db/models/chat.model');

router.use('/', messageRoutes);

// router.use('/', );

router.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

module.exports = router;
