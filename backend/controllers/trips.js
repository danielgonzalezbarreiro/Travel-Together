const { getConnection } = require('../db');

const { tripSchema, searchSchema, allowJoinSchema } = require('./validations');

const { emailToHost, emailToUser } = require('../helpers')

// GET - /trips
async function listTrips(req, res, next) {
  try {
    const connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      result = await connection.query(
        `select t.*, u.profile_name as profile_name, u.avatar_img as avatar_img, u.user_login as user_login from travels t
         left join users u on
         u.id = t.id_user where t.id_user = u.id and
        t.locality LIKE ? OR t.description LIKE ? OR t.date LIKE ?
        ORDER BY t.create_travel DESC`,
        [`%${search}%`, `%${search}%`, `%${search}%`]
      );
    } else {
      result = await connection.query(
        `select t.*, u.profile_name as profile_name, u.avatar_img as avatar_img, u.user_login as user_login from travels t
         left join users u on
         u.id = t.id_user where t.id_user = u.id
         ORDER BY t.create_travel DESC`
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

// GET - /trips/:id
async function getTrip(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [result] = await connection.query(
      `select t.*, u.profile_name as profile_name, 
                    u.avatar_img as avatar_img, 
                    u.user_login as user_login,
                    uct.user_admitted as user_admitted
      from travels t
      left join users u on u.id = t.id_user 
      left join user_choose_travel uct on uct.id_travel = t.id
      where t.id = ?`,
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
  // Put in the database
  try {
    await tripSchema.validateAsync(req.body);

    const { description, locality, date, category, budget } = req.body;

    const connection = await getConnection();

    /* const date = formatDateToDB(new Date()); */

    const [
      result
    ] = await connection.query(
      'INSERT INTO travels(description, locality, date, category, budget, id_user) VALUES(?, ?, ?, ?, ?, ?)',
      [description, locality, date, category, budget, req.auth.id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: result.insertId,
        locality: locality,
        date: date,
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
    const { locality, date, category, budget, description } = req.body;
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
      'UPDATE travels SET locality=?, date=?, category=?, budget=?,  description=? WHERE id=?',
      [locality, date, category, budget, description, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: id,
        locality: locality,
        date: date,
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
    const connection = await getConnection();

    await connection.query('DELETE FROM travels WHERE id=?', [id]);

    connection.release()

    res.send({
      status: 'ok',
      message: `The trip with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}

// GET - /trips/join:id
async function getTripPeople(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      'Select * from user_choose_travel where id_travel=? AND user_admitted=1',
      [id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /trips/allJoins/:id
async function getAllTripPeople(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `Select a.*, b.*
      FROM user_choose_travel a
      left join users b
      on a.id_user = b.id
      where id_travel=?`,
      [id]
    );
    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

// POST - /trips/join/:id
async function joinTrip(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;

    //Checks if the trip exists
    const [trip] = await connection.query(
      'SELECT * FROM travels WHERE id=?',
      [id]
    );

    if (!trip.length) {
      const error = new Error(`The trip does not exist. Please choose another existing trip`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the user is already the host
    const [host] = await connection.query(
      'SELECT * FROM travels WHERE id_user=? and id=?',
      [req.auth.id, id]
    );

    if (host.length) {
      const error = new Error(`You can't join your own trip`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the user already joinned the trip
    const [join] = await connection.query(
      'SELECT * FROM user_choose_travel where id_user=? AND id_travel=?',
      [req.auth.id, id]
    );

    const [user_login] = await connection.query(
      'SELECT user_login FROM users where id=?',
      [req.auth.id]
    )

    if (join.length) {
      const error = new Error(`You already joinned the trip`);
      error.httpCode = 400;
      throw error;
    }

    //await joinEntrySchema.validateAsync(req.body);

    const { join_message } = req.body;

    const [emailHost] = await connection.query(
      `SELECT a.email 
      from users a
      left join travels b
      on a.id = b.id_user
      where b.id=?`,
      [id]
    );
    console.log(emailHost);
    try {
      await emailToHost({
        email: emailHost,
        user_login: user_login,
        title: 'Alguien se ha apuntado a tu evento!',
        content: `El usuario te ha enviado este mensaje junto con la peticion: ${join_message}`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error sending the confirmation email. Try again later.'
      );
    }

    await connection.query(
      'INSERT INTO user_choose_travel(id_user, id_travel, choose_date, join_message) VALUES(?, ?, NOW(), ?)',
      [req.auth.id, id, join_message]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id_user: req.auth.id,
        id_trip: id,
        join_message: join_message
      }
    });
  } catch (error) {
    next(error);
  }
}

//PUT - /trips/join/:id
async function allowJoin(req, res, next) {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { id_user_join } = req.body;

    //Checks if the user is the trip's host
    const [host] = await connection.query(
      'SELECT * from travels WHERE id_user=? and id=?',
      [req.auth.id, id]
    );

    if (!host.length) {
      const error = new Error(`You can't allow people if you didn't created the trip`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the id_user_join requested to join the trip
    const [userJoin] = await connection.query(
      'SELECT * FROM user_choose_travel where id_user=? and id_travel=? and user_admitted=0',
      [id_user_join, id]
    );
    console.log(id_user_join)
    if (!userJoin.length) {
      const error = new Error(`The user didnt asked to join or its already allowed`);
      error.httpCode = 400;
      throw error;
    }

    await allowJoinSchema.validateAsync(req.body);

    const [useremail] = await connection.query(
      'select email from users where id=?',
      [id_user_join]
    );
    try {
      await emailToUser({
        email: useremail,
        title: 'Te han aceptado',
        content: `Que disfruteis de vuestro viaje!`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error sending the confirmation email. Try again later.'
      );
    }


    await connection.query(
      'UPDATE user_choose_travel SET user_admitted=1 WHERE id_user=? AND id_travel=?',
      [id_user_join, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id_trip: id,
        id_user_join: id_user_join,
      }
    });
  } catch (error) {
    next(error);
  }
}

//DELETE - /trips/join/:id
async function deleteJoin(req, res, next) {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { id_user_join } = req.body;


    //Checks if the user is the trip's host
    const [host] = await connection.query(
      'SELECT * from travels WHERE id_user=? and id=?',
      [req.auth.id, id]
    );

    if (!host.length) {
      const error = new Error(`You can't allow people if you didn't created the trip`);
      error.httpCode = 400;
      throw error;
    }

    await connection.query(
      'DELETE FROM user_choose_travel WHERE id_user=? AND id_travel=?',
      [id_user_join, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        res: res
      }
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /trips/usertrips/:id
async function getUserTrips(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `Select a.*, b.*
      from user_choose_travel a 
      left join travels b 
      on a.id_travel = b.id
      where a.id_user=?`,
      [id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /trips/usertripshosted/:id
async function getUserTripsHosted(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `SELECT *
      FROM travels
      WHERE id_user=?`,
      [id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
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
  joinTrip,
  allowJoin,
  getTripPeople,
  getAllTripPeople,
  getUserTrips,
  getUserTripsHosted,
  deleteJoin
};

