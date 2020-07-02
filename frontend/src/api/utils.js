import axios from 'axios'
import jwt from 'jwt-decode'

const ENDPOINT = 'http://localhost:3001'
const AUTH_TOKEN_KEY = 'authToken'
const ROLE = "role";

// FUNCION LOGIN
export function loginUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/login`, // URL DA AUTENTICACION
        method: 'POST', // METODO DA AUTENTICACION
        data: {
          email: email,
          user_password: password,
        } // DATOS DA AUTENTICACION
      })
      setAuthToken(res.data.data.token);
      setIsAdmin(res.data.data.user.role);
      localStorage.setItem('userID', res.data.data.user.id)
      console.log(res.data)
      resolve()
    } catch (err) {
      console.log('Error en login:', err)
      reject(err)
    }
  })
}
export function registerUser(email, password, user_login, profile_name, birthday) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users`, // URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: email,
          password: password,
          user_login: user_login,
          profile_name: profile_name,
          birthday: birthday
        },
      });
      resolve()
    } catch (err) {
      console.log('Error en Registro: ', err);
      reject(err)
    }
  })
}

//Get username from id
export function getUserName(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/username`, // URL DE LA AUTENTICACIÓN
        method: "GET", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          id: id
        }
      });
      //NON FUNCIONA, NON PASA BEN O ID O BACK
      //resolve(res.data.data[0].profile_name);
    } catch (err) {
      console.log('Error consiguiendo el nombre: ', err);
      reject(err)
    }
  })
}

//Get is follow
export function getIsFollow(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/follow/isfollow/` + id, // URL DE LA AUTENTICACIÓN
        method: "GET", // MÉTODO DE LA AUTENTICACIÓN
        data: {

        }
      });
      //NON FUNCIONA, NON PASA BEN O ID O BACK
      resolve(res.data.data[0]);
    } catch (err) {
      console.log('Error consiguiendo el nombre: ', err);
      reject(err)
    }
  })
}

// GARDAR TOKEN EN LOCALSTORAGE
export function setAuthToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

// LOGOUT
export function clearLogin() {
  axios.defaults.headers.common['Authorization'] = ''
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("Usuario");
  localStorage.removeItem("userID")
  clearAdmin();

}

// COLLER O TOKEN
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)

}

// CONSEGUINDO FECHA DE EXPERIZACION DO TOKEN

export function getTokenExpirationDate(encodedToken) {
  let token = jwt(encodedToken)
  // se non hai, non sigue
  if (!token.exp) {
    return null
  }
  let date = new Date(0)
  date.setUTCSeconds(token.exp)
  return date
}

// COMPROBANDO SE A FECHA SEGUE VIXENTE OU NON 
export function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}

// COMPROBAR SE O USUARIO ESTA LOGEADO OU NON
export function isLoggedIn() {
  let authToken = getAuthToken()
  return !!authToken && !isTokenExpired(authToken)
}

//  ----FUNCIONES PARA COMPROBAR EL ROL DEL USER-----

//GUARDAR SI ES ADMIN EN LOCAL STORAGE
export function setIsAdmin(isAdmin) {
  localStorage.setItem(ROLE, isAdmin);
}

//BORRAR ROL DEL USER EN LOCAL STORAGE
export function clearAdmin() {
  return localStorage.removeItem(ROLE);
}

// RECUPERAR ROL DESDE LOCAL STORAGE
export function getIsAdmin() {
  return localStorage.getItem(ROLE);
}






