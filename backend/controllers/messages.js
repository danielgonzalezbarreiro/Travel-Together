const { getConnection } = require('../db');
const {
  generateError
} = require('../helpers');

// POST - /message/:id
async function newMessage(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;
    const { msg_text } = req.body;

    if (Number(id) === req.auth.id) {
      throw generateError(
        `You do not send yourself a message`,
        401
      )
    }

    await connection.query(
      'INSERT INTO messages(msg_text, id_user_send, id_user_recive) VALUES(?,?,?)',
      [msg_text, req.auth.id, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        msg_text: msg_text,
        id_user_send: req.auth.id,
        id_user_recive: id
      }
    })

  } catch (error) {
    next(error);
  }
}

// GET - /message
async function getMessages(req, res, next) {
  try {
    const connection = await getConnection();

    const result = await connection.query(
      `SELECT * FROM messages WHERE id_user_recive = ?`,
      [req.auth.id]
    )

    const [message] = result

    connection.release();

    res.send({
      status: 'ok',
      data: message
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  newMessage,
  getMessages
}