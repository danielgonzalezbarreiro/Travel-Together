<template>
  <div class="trips">
    <div class="container">
      <header class="header">
        <h6>ID</h6>
        <h6>User Login</h6>
        <h6>Destino</h6>
        <h6>Fecha creado</h6>
        <h6>Eliminar</h6>
      </header>

      <div class="tripsadmin" v-for="trip in trips" :key="trip.id">
        <router-link
          class="id"
          id="link"
          :to="{ name: 'TripView', params:{ id: trip.id }}"
        >{{trip.id}}</router-link>
        <p class="user_login">{{'@'+trip.user_login}}</p>
        <p class="locality">{{trip.locality}}</p>
        <p class="create_travel">{{trip.create_travel.substr(0,10)}}</p>

        <button class="buttonremove" @click="deleteTrip(trip.id)">
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
  name: "TripsAdmin",
  data() {
    return {};
  },
  props: {
    trips: Array
  },
  methods: {
    deleteTrip(id) {
      let self = this;
      axios
        .delete(`http://localhost:3001/trips/` + id, {
          data: {}
        })
        .then(function(response) {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Viaje eliminado",
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

.tripsadmin {
  display: grid;
  margin-top: 0.5rem;
  padding: 0.5rem;
  grid-template-columns: 9% 20% 20% 20% 20%;
  grid-template-rows: 100%;
  grid-template-areas: "id user_login locality create_travel buttonremove";
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

.locality {
  grid-area: locality;
}

.create_travel {
  grid-area: create_travel;
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

