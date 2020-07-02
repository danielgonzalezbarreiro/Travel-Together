import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import { isLoggedIn } from '../api/utils'

Vue.use(VueRouter)

axios.defaults.headers.common["Authorization"] = localStorage.getItem('authToken');

const routes = [
  {
    path: '/',
    name: 'Trips',
    component: () => import('../views/Trips.vue')
  },
  {
    path: '/underconstrution',
    name: 'UnderConstrution',
    component: () => import('../views/UnderConstrution.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (isLoggedIn() === true) {
        next({
          path: "/",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (isLoggedIn() === true) {
        next({
          path: "/trips",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/usertrips/:id',
    name: 'UserTrips',
    component: () => import('../views/UserTrips.vue'),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Tienes que estar logeado para ver esta página",
        });
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/trips/:id',
    name: 'TripView',
    component: () => import('../views/TripView.vue'),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Tienes que estar logeado para ver esta página",
        });
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/settings/:id',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Tienes que estar logeado para ver esta página",
        });
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Tienes que estar logeado para ver esta página",
        });
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
]

const router = new VueRouter({
  routes
})

export default router
