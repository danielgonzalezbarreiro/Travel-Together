const { getConnection } = require('../db');
const {
  generateError
} = require('../helpers');

// POST - /followers/:id
async function newFollow(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;

    if (Number(id) === req.auth.id) {
      throw generateError(
        `You do not follow yourself`,
        401
      )
    }

    const result = await connection.query(
      `SELECT * FROM follow WHERE user_id = ? and follower_id = ?`,
      [id, req.auth.id]
    )
    const [follow] = result

    if (follow[0]) {
      throw generateError(`You already follow user ${id}`)
    }


    await connection.query(
      'INSERT INTO follow(follower_id, user_id) VALUES(?,?)',
      [req.auth.id, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        follower_id: req.auth.id,
        user_id: id
      }
    })

  } catch (error) {
    next(error);
  }
}

// GET - /followers/:id
async function getFollowers(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params

    const result = await connection.query(
      `SELECT follower_id FROM follow WHERE user_id = ?`,
      [id]
    )

    const [followers] = result

    connection.release();

    res.send({
      status: 'ok',
      data: followers
    })

  } catch (error) {
    next(error)
  }
}

// GET - /following/:id
async function getFollowing(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params

    const result = await connection.query(
      `SELECT user_id FROM follow WHERE follower_id = ?`,
      [id]
    )

    const [follow] = result

    connection.release();

    res.send({
      status: 'ok',
      data: follow
    })

  } catch (error) {
    next(error)
  }
}



// GET - /follow/isfollow/:id
async function getIsFollow(req, res, next) {
  try {
    const connection = await getConnection();

    console.log('ei')
    const { id } = req.params

    const result = await connection.query(
      `SELECT * FROM follow WHERE user_id = ? and follower_id = ?`,
      [id, req.auth.id]
    )
    const [follow] = result

    connection.release();

    res.send({
      status: 'ok',
      data: follow
    })

  } catch (error) {
    next(error)
  }
}


// DELETE - /follow/:id
async function deleteFollow(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const result = await connection.query(
      `SELECT * FROM follow WHERE user_id = ? and follower_id = ?`,
      [id, req.auth.id]
    )
    const [follow] = result

    if (!follow[0]) {
      throw generateError(`You don't follow user ${id}`)
    }

    await connection.query('DELETE FROM follow WHERE user_id = ? AND follower_id = ?', [id, req.auth.id]);

    connection.release()

    res.send({
      status: 'ok',
      message: `You nou longer follow user with ${id}`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  newFollow,
  getFollowers,
  deleteFollow,
  getIsFollow,
  getFollowing
}