require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');

const {
  userSchema,
  editUserSchema,
  editPasswordUserSchema,
  userSchemaRegister
} = require('./validations');

const {
  processAndSavePhoto,
  deletePhoto,
  randomString,
  sendEmail,
  generateError,
  formatDatetoDB
} = require('../helpers');


// PUT - /profile/:id
async function editUserProfile(req, res, next) {
  let connection;

  try {
    //await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const { profile_name, biography, locality, birthday } = req.body;
    console.log('birthday')

    connection = await getConnection();

    // Check if user exists

    const [current] = await connection.query(
      `
      SELECT id, avatar_img FROM users WHERE id=?
    `,
      [id]
    );

    if (!current.length) {
      throw generateError(`The user with id ${id} does not exist`, 404);
    }

    // Check if auth user is the same as :id or is admin
    if (current[0].id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('You do not have permission to edit this user', 401);
    }

    // Check if there is a uploaded avatar and process it

    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        savedFileName = await processAndSavePhoto(req.files.avatar);

        if (current && current.avatar) {
          await deletePhoto(current.avatar);
        }
      } catch (error) {
        throw generateError('Can not process upload image. Try again.', 400);
      }
    } else {
      savedFileName = current.avatar;
    }

    // Update user
    await connection.query(
      `
      UPDATE users SET profile_name=?, biography=?, locality=?, avatar_img=?, birthday=? WHERE id=?
    `,
      [profile_name, biography, locality, savedFileName, birthday, id]
    );

    res.send({ status: 'ok', message: 'User update' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// PUT - /profile/avatar/:id
async function editUserAvatar(req, res, next) {
  let connection;

  try {
    //await editUserSchema.validateAsync(req.body);

    const { id } = req.params;

    connection = await getConnection();

    // Check if user exists

    const [current] = await connection.query(
      `
      SELECT id, avatar_img FROM users WHERE id=?
    `,
      [id]
    );

    if (!current.length) {
      throw generateError(`The user with id ${id} does not exist`, 404);
    }

    // Check if auth user is the same as :id or is admin
    if (current[0].id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('You do not have permission to edit this user', 401);
    }

    // Check if there is a uploaded avatar and process it

    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        savedFileName = await processAndSavePhoto(req.files.avatar);

        if (current && current.avatar) {
          await deletePhoto(current.avatar);
        }
      } catch (error) {
        throw generateError('Can not process upload image. Try again.', 400);
      }
    } else {
      savedFileName = current.avatar;
    }

    // Update user
    await connection.query(
      `
      UPDATE users SET avatar_img=? WHERE id=?
    `,
      [savedFileName, id]
    );

    res.send({ status: 'ok', message: 'User update' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}



module.exports = {
  editUserProfile,
  editUserAvatar
};