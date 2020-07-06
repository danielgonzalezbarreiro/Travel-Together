<template>
  <div class="reel">
    <div class="container">
      <header class="header">
        <h6>ID</h6>
        <h6>User Login</h6>
        <h6>Texto Foto</h6>
        <h6>Fecha creado</h6>
        <h6>Eliminar</h6>
      </header>

      <div class="reeladmin" v-for="photo in reel" :key="photo.id">
        <router-link
          class="id"
          id="link"
          :to="{ name: 'PhotoView', params:{ id: photo.id }}"
        >{{photo.id}}</router-link>
        <p class="user_login">{{'@'+photo.user_login}}</p>
        <p class="text">{{photo.text}}</p>
        <p class="create_photo">{{photo.create_photo.substr(0,10)}}</p>

        <button class="buttonremove" @click="deletePhoto(photo.id)">
          <img src="../../assets/icons/delete.svg" alt />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "ReelAdmin",
  data() {
    return {};
  },
  props: {
    reel: Array
  },
  methods: {
    deletePhoto(id) {
      let self = this;
      axios
        .delete(`http://localhost:3001/reel/` + id, {
          data: {}
        })
        .then(function(response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Foto eliminada",
            confirmButtonText: "Ok",
            background: "#1e1c2c",
            confirmButtonColor: "#ff6d00"
          });
          setTimeout(function() {
            location.reload();
          }, 1500);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
  background-color: #0f0e1d;
}

.container {
  margin: 2rem;
  height: 50rem;
}

.header {
  display: grid;
  grid-template-columns: 10% 18% 22% 18% 21%;
  grid-template-rows: 100%;
  padding: 0.25rem 0;
  border-bottom: 1px solid white;
}

.header h6 {
  font-size: 18px;
  justify-self: center;
}

.reeladmin {
  display: grid;
  margin-top: 0.5rem;
  padding: 0.5rem;
  grid-template-columns: 9% 20% 20% 20% 20%;
  grid-template-rows: 100%;
  grid-template-areas: "id user_login text create_photo buttonremove";
}

.id {
  grid-area: id;
  justify-self: center;
  text-decoration: none;
  transition: 0.3;
}

.id:hover {
  font-weight: bold;
}

.user_login {
  grid-area: user_login;
  justify-self: center;
}

.text {
  grid-area: text;
}

.create_photo {
  grid-area: create_photo;
  justify-self: center;
}

.buttonremove {
  grid-area: buttonremove;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  opacity: 0.5;
  transition: 0.3s;
}

button:hover {
  opacity: 1;
}

img {
  width: 25px;
  height: 25px;
}
</style>

