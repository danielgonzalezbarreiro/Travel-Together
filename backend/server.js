require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT;

// User Controllers

const {
  newUser,
  getUser,
  editUser,
  loginUser,
  updatePasswordUser,
  validateUser,
  getUserName
} = require('./controllers/users');

// Profile controllers

const {
  editUserProfile,
  editUserAvatar
} = require('./controllers/profile')

//Trip controllers

const {
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
  getUserTripsHosted

} = require('./controllers/trips')

// Message controllers
const {
  newMessage,
  getMessages
} = require('./controllers/messages')

// Rating controllers
const {
  newRating,
  getRating,
  deleteRating
} = require('./controllers/rating')

// Follow controllers
const {
  newFollow,
  getFollowers,
  deleteFollow,
  getIsFollow
} = require('./controllers/followers')

// Auth middlewares
const { userIsAuthenticated, userIsAdmin } = require('./middlewares/auth');

// Console logger middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json());

// Multipart parsing middleware
app.use(fileUpload());

// CORS middleware
app.use(cors());

// Serve static
app.use(express.static(path.join(__dirname, 'static')));

// User Routes
app.post('/users', newUser);
app.post('/users/login', loginUser);
app.get('/users/validate', validateUser);
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser);
app.get('/users/:id', userIsAuthenticated, getUser);
app.put('/users/:id', userIsAuthenticated, editUser);
app.get('/username', getUserName)

// Profile Routes
app.put('/profile/:id', userIsAuthenticated, editUserProfile);
app.put('/profile/avatar/:id', userIsAuthenticated, editUserAvatar);

// Trip Routes
app.get('/trips', listTrips);
app.get('/trips/:id', getTrip);
app.post('/trips', userIsAuthenticated, newTrip); // Solo usuarios
app.put('/trips/:id', userIsAuthenticated, editTrip); // Solo usuarios (que crearon esa entrada) o admin
app.delete('/trips/:id', userIsAuthenticated, userIsAdmin, deleteTrip); // Solo admin 
app.get('/trips/join/:id', userIsAuthenticated, getTripPeople)
app.post('/trips/join/:id', userIsAuthenticated, joinTrip)
app.put('/trips/join/:id', userIsAuthenticated, allowJoin)
app.get('/trips/allJoins/:id', userIsAuthenticated, getAllTripPeople)
app.get('/trips/usertrips/:id', userIsAuthenticated, getUserTrips)
app.get('/trips/usertripshosted/:id', userIsAuthenticated, getUserTripsHosted)

// Message Routes
app.post('/message/:id', userIsAuthenticated, newMessage)
app.get('/message', userIsAuthenticated, getMessages)

// Rating Routes
app.post('/rating/:id', userIsAuthenticated, newRating)
app.get('/rating/:id', userIsAuthenticated, getRating)
app.delete('/rating/:id', userIsAuthenticated, userIsAdmin, deleteRating)

// Follow Routes
app.post('/follow/:id', userIsAuthenticated, newFollow)
app.get('/followers/:id', userIsAuthenticated, getFollowers)
app.delete('/follow/:id', userIsAuthenticated, deleteFollow)
app.get('/follow/isfollow/:id', userIsAuthenticated, getIsFollow)

// Error middleware
app.use((error, req, res, next) => {
  // console.error(error);
  res.status(error.httpCode || 500).send({
    status: 'error',
    message: error.message
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port} 🚀`);
});