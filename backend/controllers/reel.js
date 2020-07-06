const { getConnection } = require('../db');
const {
  generateError,
  processAndSavePhotoReel
} = require('../helpers');

// POST - /reel
async function newPhoto(req, res, next) {
  try {

    const { photo_text } = req.body;

    const connection = await getConnection();

    let savedFileName;

    try {
      savedFileName = await processAndSavePhotoReel(req.files.photo);

    } catch (error) {
      throw generateError('Can not process upload image. Try again.', 400);
    }

    await connection.query(
      'INSERT INTO reel(user_id, photo, text) VALUES(?,?,?)',
      [req.auth.id, savedFileName, photo_text]
    );

    connection.release();

    res.send({
      status: 'ok',
      message: 'Photo upload'
    });

  } catch (error) {
    next(error);
  }
}

// GET - /reel
async function listPhotos(req, res, next) {
  try {
    const connection = await getConnection();

    const result = await connection.query(
      `SELECT r.*, u.user_login as user_login, 
                    u.profile_name as profile_name,
                    u.avatar_img as avatar_img 
        from reel r
        left join users u on
        u.id = r.user_id where r.user_id = u.id
        ORDER BY r.create_photo DESC
        `,
    );

    const [reel] = result;
    connection.release();

    res.send({
      status: 'ok',
      data: reel
    });
  } catch (error) {
    next(error);
  }
}

// GET - /photo/:id
async function getPhoto(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [result] = await connection.query(
      `select r.*, u.user_login as user_login, 
                    u.profile_name as profile_name,
                    u.avatar_img as avatar_img 
      from reel r
      left join users u on 
      u.id = r.user_id 
      where r.id = ?`,
      [id]
    );

    if (!result[0].id) {
      const error = new Error(`The photo with id ${id} does not exist`);
      error.httpCode = 404;
      throw error;
    }

    connection.release();

    res.send({
      status: 'ok',
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
}

// PUT - /reel/:id
async function editPhoto(req, res, next) {
  try {
    const { photo_text } = req.body;
    const { id } = req.params;

    const connection = await getConnection();

    const [
      current
    ] = await connection.query('SELECT user_id FROM reel WHERE id=?', [
      id
    ]);

    if (!current.length) {
      const error = new Error(`The photo with id ${id} does not exist`);
      error.httpCode = 404;
      throw error;
    }

    // Check if the authenticated user is the entry author or admin
    if (current[0].id_user !== req.auth.id && req.auth.role !== 'admin') {
      const error = new Error('No tienes permisos para editar esta entrada');
      error.httpCode = 401;
      throw error;
    }


    await connection.query(
      'UPDATE reel SET text=? WHERE id=?',
      [photo_text, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: id,
        photo_text: photo_text,
      }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - /reel/:id
async function deletePhoto(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const [current] = await connection.query(
      `
      SELECT user_id, photo FROM reel WHERE id=?
    `,
      [id]
    );

    // Check if auth user is the same as :id or is admin
    if (current[0].user_id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('You do not have permission to edit this user', 401);
    }
    try {
      if (current.photo) {
        await deletePhoto(current.photo)
      }
    } catch (error) {
      throw generateError('Can not delete image. Try again.', 400);
    }
    await connection.query('DELETE FROM reel WHERE id=?', [id]);

    connection.release()

    res.send({
      status: 'ok',
      message: `The photo with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  newPhoto,
  deletePhoto,
  listPhotos,
  getPhoto,
  editPhoto
};