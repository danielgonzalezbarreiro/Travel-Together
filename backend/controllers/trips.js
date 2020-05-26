const { getConnection } = require('../db');

const { tripSchema, searchSchema } = require('./validations');

//const { generateError } = require('../helpers')

// GET - /entries
async function listTrips(req, res, next) {
  try {
    const connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      result = await connection.query(
        `SELECT * FROM travels
        WHERE travels.locality LIKE ? OR travels.description LIKE ?
        ORDER BY travels.departure_date DESC`,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      result = await connection.query(
        `SELECT * FROM travels
        ORDER BY travels.departure_date DESC`
      );
    }

    const [trips] = result;

    connection.release();

    res.send({
      status: 'ok',
      data: trips
    });
  } catch (error) {
    next(error);
  }
}

// GET - /entries/:id
async function getTrip(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [result] = await connection.query(
      `SELECT * FROM travels
      WHERE id = ?`,
      [id]
    );

    if (!result[0].id) {
      const error = new Error(`The trip with id ${id} does not exist`);
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

// POST - /trips
async function newTrip(req, res, next) {
  //Meterlos en la base de datos
  try {
    await tripSchema.validateAsync(req.body);

    const { description, locality, departure_date, arrival_date, category, budget } = req.body;

    const connection = await getConnection();

    /* const date = formatDateToDB(new Date()); */

    const [
      result
    ] = await connection.query(
      'INSERT INTO travels(description, locality, departure_date, arrival_date, category, budget, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',
      [description, locality, departure_date, arrival_date, category, budget, req.auth.id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: result.insertId,
        locality: locality,
        departure_date: departure_date,
        arrival_date: arrival_date,
        category: category,
        budget: budget,
        description: description,
        user_id: req.auth.id
      }
    });
  } catch (error) {
    next(error);
  }
}

// PUT - /trips/:id
async function editTrip(req, res, next) {
  try {
    const { locality, departure_date, arrival_date, category, budget, description } = req.body;
    const { id } = req.params;

    await tripSchema.validateAsync(req.body);

    const connection = await getConnection();

    const [
      current
    ] = await connection.query('SELECT id_user FROM travels WHERE id=?', [
      id
    ]);

    if (!current.length) {
      const error = new Error(`The trip with id ${id} does not exist`);
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
      'UPDATE travels SET locality=?, departure_date=?, arrival_date=?, category=?, budget=?,  description=? WHERE id=?',
      [locality, departure_date, arrival_date, category, budget, description, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: id,
        locality: locality,
        departure_date: departure_date,
        arrival_date: arrival_date,
        category: category,
        budget: budget,
        description: description,
      }
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - /trips/:id
async function deleteTrip(req, res, next) {
  try {
    const { id } = req.params;

    res.send({
      status: 'ok',
      message: `The trip with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}

// POST - /trips/:id/choose
async function chooseTrip(req, res, next) {
  try {
    const { id } = req.params;
    const { choose_date } = req.body;

    const connection = await getConnection();

    const [id_result] = await connection.query(
      `SELECT * FROM travels
      WHERE id = ?`,
      [id]
    );

    const id_travel = id_result[0].id

    if (!id_result[0].id) {
      const error = new Error(`The trip with id ${id} does not exist`);
      error.httpCode = 404;
      throw error;
    }

    //Check user_id of travel and choose_id its no the same. !Dont work
    /*     if (id_result[0].user_id === req.auth.id) {
          const error = new error(`You can't choose your trip`)
          error.httpCode = 400;
          throw error;
        }
     */
    await connection.query(
      'INSERT INTO user_choose_travel(id_user, id_travel, choose_date) VALUES(?, ?, NOW())',
      [req.auth.id, id_travel, choose_date]
    );

    res.send({
      id_user: req.auth.id,
      id_travel: id_travel,
    })

    connection.release();
  } catch (error) {
    next(error);
  }
}


module.exports = {
  listTrips,
  newTrip,
  editTrip,
  deleteTrip,
  getTrip,
  chooseTrip
};

