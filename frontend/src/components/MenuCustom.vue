<template>
  <div class="MenuCustom">
    <div class="navcontainer">
      <router-link class="logo" id="link" :to="{ name: 'Trips'}">Logo</router-link>
      <router-link class="trips" id="link" :to="{ name: 'Trips'}">
        <font-awesome-icon class="icon" icon="route" />Viajes
      </router-link>
      <router-link class="photosreel" id="link" :to="{ name: 'UnderConstrution'}">
        <font-awesome-icon class="icon" icon="images" />Carrete
      </router-link>
      <router-link class="messages" id="link" :to="{ name: 'UnderConstrution'}">
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
  grid-template-rows: 20% 10% 10% 10% 10% 150% 15% 17% 1%;
  gap: 15px;
  grid-template-areas: "logo" "trips" "photosreel" "messages" "settings" "profile" "logout" "login" "register";
}

button {
  width: 8rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 0.667rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
}

button:hover {
  background: #c0440f;
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
}

.logo:hover {
  font-weight: bold;
}

.trips {
  grid-area: trips;
}

.trips:hover {
  font-weight: bold;
}

.photosreel {
  grid-area: photosreel;
}

.photosreel:hover {
  font-weight: bold;
}

.messages {
  grid-area: messages;
}

.messages:hover {
  font-weight: bold;
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
}

.settings {
  grid-area: settings;
}

.settings:hover {
  font-weight: bold;
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