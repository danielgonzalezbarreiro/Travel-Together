<template>
  <div class="adminview">
    <vue-headful title="Admin" description="Administracion de sitio" />
    <roller class="roller" v-show="loading"></roller>
    <menucustom class="menucustom"></menucustom>

    <div class="admincontainer" v-show="!loading">
      <nav class="nav">
        <button @click="viewTrips()">Trips</button>
        <button @click="viewUsers()">Users</button>
        <button @click="viewReel()">Reel</button>
      </nav>

      <tripsadmin v-show="tripsShow" class="trips" :trips="trips"></tripsadmin>
      <usersadmin v-show="usersShow" class="trips" :users="users"></usersadmin>
      <reeladmin v-show="reelShow" class="trips" :reel="reel"></reeladmin>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import menucustom from "@/components/MenuCustom.vue";
import roller from "@/components/RollerComponent.vue";
import tripsadmin from "@/components/admin/TripsAdmin.vue";
import usersadmin from "@/components/admin/UsersAdmin.vue";
import reeladmin from "@/components/admin/ReelAdmin.vue";

import Swal from "sweetalert2";

export default {
  name: "Admin",
  components: {
    menucustom,
    tripsadmin,
    usersadmin,
    reeladmin,
    roller
  },
  data() {
    return {
      trips: [],
      users: [],
      reel: [],
      loading: true,
      tripsShow: true,
      usersShow: false,
      reelShow: false
    };
  },
  methods: {
    getTrips() {
      let self = this;
      axios
        .get(`http://localhost:3001/trips`)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.trips = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getUsers() {
      let self = this;
      axios
        .get(`http://localhost:3001/users`)
        .then(function(response) {
          setTimeout(function() {
            self.loading = false;
            self.users = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getReel() {
      let self = this;
      axios
        .get(`http://localhost:3001/reel`)
        .then(function(response) {
          setTimeout(function() {
            self.loading = false;
            self.reel = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    viewTrips() {
      this.tripsShow = true;
      this.usersShow = false;
      this.reelShow = false;
    },
    viewUsers() {
      this.tripsShow = false;
      this.usersShow = true;
      this.reelShow = false;
    },
    viewReel() {
      this.tripsShow = false;
      this.usersShow = false;
      this.reelShow = true;
    }
  },
  created() {
    this.getTrips();
    this.getUsers();
    this.getReel();
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
  color: white;
}

/* CONTAINER ADMIN */
.admincontainer {
  align-items: center;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 5% 95%;
  grid-template-areas: "menucustom nav" "menucustom trips";
  background-color: #1e1c2c;
  min-height: 100vh;
}

.menucustom {
  grid-area: menucustom;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.nav {
  grid-area: nav;
  text-align: center;
  background-color: #1e1c2c;
  position: fixed;
  margin-left: 11rem;
  width: 91%;
}

.nav button {
  border: none;
  align-self: center;
  justify-self: center;
  margin: 1rem;
  font-size: 20px;
  opacity: 0.5;
  transition: 0.3s;
  cursor: pointer;
  outline: none;
}

.nav button:hover {
  opacity: 1;
}

.trips {
  grid-area: trips;
}

.roller {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
</style>