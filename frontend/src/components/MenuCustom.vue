<template>
  <div class="MenuCustom">
    <div class="navcontainer">
      <router-link class="logo" id="link" :to="{ name: 'Trips'}">
        <img src="../assets/logo.png" alt />
        <p>Travel Together</p>
      </router-link>
      <router-link class="trips" id="link" :to="{ name: 'Trips'}">
        <font-awesome-icon class="icon" icon="route" />Viajes
      </router-link>
      <router-link class="photosreel" id="link" :to="{ name: 'Reel'}">
        <font-awesome-icon class="icon" icon="images" />Carrete
      </router-link>
      <router-link class="messages" id="link" :to="{ name: 'UnderConstruction'}">
        <font-awesome-icon class="icon" icon="envelope" />Mensajes
      </router-link>
      <router-link class="settings" id="link" :to="{ name: 'Settings', params:{ id: this.userID }}">
        <font-awesome-icon class="icon" icon="cog" />Ajustes
      </router-link>
      <router-link class="profile" id="link" :to="{ name: 'Profile', params:{ id: this.userID }}">
        <img
          v-show="!showInfo"
          class="profile"
          :src="profile.avatar_img ? path + profile.avatar_img : defaultAvatar"
          alt
        />
      </router-link>
      <button v-show="!showInfo" id="link" class="logout" @click="logoutUser()">Logout</button>
      <button v-show="showInfo" id="link" class="register" @click="registerUser()">Register</button>
      <button v-show="showInfo" id="link" class="login" @click="loginUser()">Login</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faRoute,
  faCog,
  faImages,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

library.add(faRoute, faCog, faImages, faEnvelope);

import { clearLogin, isLoggedIn } from "../api/utils";
export default {
  name: "MenuCustom",
  data() {
    return {
      profile: {},
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      showInfo: true,
      userID: 0
    };
  },
  methods: {
    checkLogin() {
      if (isLoggedIn() === true) {
        this.showInfo = false;
        this.getProfileAvatar();
      } else {
        this.showInfo = true;
      }
    },

    loginUser() {
      this.$router.push("login");
    },
    registerUser() {
      this.$router.push("register");
    },

    logoutUser() {
      clearLogin();
      this.$router.push("/");
      location.reload();
      return;
    },
    getUserName() {
      //this.nombreUsuario = localStorage.getItem("userID");
      if (localStorage.getItem("userID")) {
        this.userID = localStorage.getItem("userID");
      } else {
        this.userID = 0;
      }
    },
    getProfileAvatar() {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + this.userID)
        .then(function(response) {
          self.profile = response.data.data;
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    }
  },
  created() {
    this.getUserName();
    this.checkLogin();
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}
.navcontainer {
  background-color: #1e1c2c;
  align-items: center;
  margin: 1rem;
  min-height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 20% 10% 10% 10% 10% 115% 15% 17% 1%;
  gap: 15px;
  grid-template-areas: "logo" "trips" "photosreel" "messages" "settings" "profile" "logout" "login" "register";
}

button {
  width: 8.4rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 0.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

button:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

#link {
  text-decoration: none;
  color: white;
}

.icon {
  margin-right: 1rem;
}

.logo {
  grid-area: logo;
  align-self: center;
  justify-self: center;
}

.logo img {
  width: 50px;
  height: 50px;
  margin-left: 1.8rem;
  transition: 0.3s;
}

.logo img:hover {
  opacity: 0.7;
}

.logo p {
  font-family: "Braxton";
  text-align: center;
  font-size: 22px;
}

.trips {
  grid-area: trips;
  opacity: 0.7;
  transition: 0.2s;
}

.trips:hover {
  font-weight: bold;
  opacity: 1;
}

.photosreel {
  grid-area: photosreel;
  opacity: 0.7;
  transition: 0.2s;
}

.photosreel:hover {
  font-weight: bold;
  opacity: 1;
}

.messages {
  grid-area: messages;
  opacity: 0.7;
  transition: 0.2s;
}

.messages:hover {
  font-weight: bold;
  opacity: 1;
}

.profile {
  grid-area: profile;
  align-self: end;
  margin: 0 auto;
}

.profile img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transition: 0.3s;
}

.profile img:hover {
  opacity: 0.7;
  box-shadow: 4px 4px rgba(15, 14, 29, 0.5);
}

.settings {
  grid-area: settings;
  opacity: 0.7;
  transition: 0.2s;
}

.settings:hover {
  font-weight: bold;
  opacity: 1;
}

.logout {
  grid-area: logout;
}

.login {
  grid-area: login;
}

.register {
  grid-area: register;
}
</style>