import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import { isLoggedIn, checkAdmin } from '../api/utils'

Vue.use(VueRouter)

axios.defaults.headers.common["Authorization"] = localStorage.getItem('authToken');

const routes = [
  {
    path: '/',
    name: 'Trips',
    component: () => import('../views/trips/Trips.vue')
  },
  {
    path: '/underconstruction',
    name: 'UnderConstruction',
    component: () => import('../views/UnderConstruction.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/user/Register.vue'),
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
    component: () => import('../views/user/Login.vue'),
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
    path: '/trips/:id',
    name: 'TripView',
    component: () => import('../views/trips/TripView.vue'),
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
    component: () => import('../views/user/Settings.vue'),
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
    component: () => import('../views/user/Profile.vue'),
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
    path: '/reel',
    name: 'Reel',
    component: () => import('../views/reel/Reel.vue'),
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
    path: '/reel/:id',
    name: 'PhotoView',
    component: () => import('../views/reel/PhotoView.vue'),
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
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      // RUTA PRIVADA
      allowAnonymous: false,
    },
    beforeEnter: (to, from, next) => {
      // Si la ruta es privada y la persona no tiene token
      if (!to.meta.allowAnonymous && !isLoggedIn() && !checkAdmin()) {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: "Tienes que estar logeado para ver esta página y tienes que ser Administrador",
        });
        next({
          path: "/",
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
