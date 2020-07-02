const { getConnection } = require('../db');
const {
  generateError
} = require('../helpers');

// POST - /rating/:id
async function newRating(req, res, next) {
  try {
    const connection = await getConnection();

    const { rate_text, points, id } = req.body
    console.log(id)
    console.log(req.auth.id)

    if (Number(id) === req.auth.id) {
      throw generateError(
        `You do not rate yourself`,
        401
      )
    }

    await connection.query(
      'INSERT INTO rates(rate_text, points, id_user_send, id_user_recive) VALUES(?,?,?,?)',
      [rate_text, points, req.auth.id, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        rate_text: rate_text,
        points: points,
        id_user_send: req.auth.id,
        id_user_recive: id
      }
    })

  } catch (error) {
    next(error);
  }
}

// GET - /rating/:id
async function getRating(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params

    /* const result = await connection.query(
      `select r.*, u.profile_name as profile_name from rates r
       left join users u on
       u.id = r.id_user_send where r.id_user_recive = 1`,
      [req.auth.id]
    ) */
    const result = await connection.query(
      `SELECT AVG(points)
       AS rate_media
       FROM rates where id_user_recive = ?`,
      [id]
    )

    const [rates] = result
    console.log(rates)

    connection.release();

    res.send({
      status: 'ok',
      data: rates
    })

  } catch (error) {
    next(error)
  }
}

// DELETE - /rating/:id
async function deleteRating(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    await connection.query('DELETE FROM rates WHERE id=?', [id]);

    connection.release()

    res.send({
      status: 'ok',
      message: `The rating with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}



module.exports = {
  newRating,
  getRating,
  deleteRating
}