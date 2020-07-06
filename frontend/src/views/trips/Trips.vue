<template>
  <div>
    <vue-headful title="Trips" description="Viajes" />

    <div class="tripscontainer">
      <menucustom class="menucustom"></menucustom>
      <!--  SIMBOLO DE CARGA  -->
      <roller class="roller" v-show="loading"></roller>

      <div v-show="!loading" class="searchTrip">
        <select v-model="filter">
          <option disabled value>Filtrado por...</option>
          <option value="locality">Destino</option>
          <option value="date">Fecha</option>
        </select>
        <input
          v-model.trim="search"
          id="search"
          name="bySearch"
          type="search"
          placeholder="Busqueda"
          v-show="!dateInput"
        />
        <input
          v-model.trim="search"
          id="search"
          name="bySearch"
          type="date"
          placeholder="Busqueda"
          v-show="dateInput"
        />

        <button class="search" @click="getTrips()">
          <font-awesome-icon class="icon" icon="search" />
        </button>
        <button class="newtrip" @click="openModal()">Nuevo viaje</button>
      </div>

      <showtripslist class="trips" :trips="trips"></showtripslist>

      <div class="trips" v-show="noSearchTrips">
        <h2>No hay resultados</h2>
      </div>
      <!-- MODAL PARA AÑADIR TRIP -->
      <transition name="fade">
        <div class="modal" v-show="modal">
          <div class="modalBox">
            <h2 class="headerform">Añadir viaje</h2>
            <label class="localitylabel" for="locality">Ubicación:</label>
            <input
              class="locality"
              v-model="locality"
              placeholder="Introduce el destino de tu viaje"
            />

            <label class="datelabel" for="date">Fecha:</label>
            <input
              class="date"
              v-model="date"
              type="date"
              placeholder="Introduce la fecha en la que quieres viajar"
            />

            <label class="categorylabel" for="category">Categoria:</label>
            <input
              class="category"
              v-model="category"
              placeholder="Introduce la categoria de tu viaje"
            />

            <label class="budgetlabel" for="budget">Presupuesto:</label>
            <input
              class="budget"
              v-model="budget"
              type="number"
              placeholder="Introduce el presupuesto estimado de tu viaje"
            />

            <label class="descriptionlabel" for="description">Descripción:</label>
            <textarea
              class="decription"
              v-model="description"
              name="description"
              placeholder="Introduce una descripcion breve de tu viaje"
              rows="40"
              cols="40"
            />

            <button class="buttonformadd" @click="addTrip(), closeModal()">Add</button>
            <button class="buttonformclose" @click="closeModal()">
              <font-awesome-icon class="icon" icon="times" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import showtripslist from "@/components/trips/ShowTripsList.vue";
import menucustom from "@/components/MenuCustom.vue";
import roller from "@/components/RollerComponent.vue";

import { isLoggedIn } from "../../api/utils.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faSearch, faTimes);

export default {
  name: "Trips",
  components: {
    showtripslist,
    menucustom,
    roller
  },
  data() {
    return {
      trips: [],
      search: "",
      filter: "",
      //Variables añadir trip
      locality: "",
      date: "",
      category: "",
      budget: "",
      description: "",
      errorMsg: "Error",
      modal: false,
      loading: true,
      dateInput: false,
      correctData: false,
      required: false,
      noSearchTrips: false
    };
  },
  methods: {
    getTrips() {
      let self = this;
      axios
        .get(`http://localhost:3001/trips?search=${self.search}`)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.trips = response.data.data;
            self.checkSearchTrips();
            console.log(self.trips);
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkSearchTrips() {
      if (this.trips.length === 0) {
        this.noSearchTrips = true;
      } else {
        this.noSearchTrips = false;
      }
    },
    clearInput() {
      (this.search = ""), (this.filter = "");
      this.getSpaces();
    },
    errorNotification(msg) {
      this.errorMsg = msg;
      this.correctData = false; // NON ENVIAR
      this.required = true; // MOSTRA O MENSAXE

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${this.errorMsg}`
      });
    },
    validatingData() {
      if (
        this.locality === "" ||
        this.date === "" ||
        this.category === "" ||
        this.budget === "" ||
        this.description === ""
      ) {
        this.errorNotification("Por favor cubre todos los campos");
        return;
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    addTrip() {
      this.validatingData(); // VALIDANDO DATOS DO FORM
      if (this.correctData === true) {
        let self = this;
        axios
          .post("http://localhost:3001/trips", {
            locality: self.locality,
            date: self.date,
            category: self.category,
            budget: self.budget,
            description: self.description
          })
          .then(function(response) {
            //self.emptyFields();
            Swal.fire({
              icon: "success",
              title: "Viaje publicado!",
              text: "Disfruta de tu viaje!",
              background: "#1e1c2c",
              confirmButtonColor: "#ff6d00"
            });
            setTimeout(function() {
              location.reload();
            }, 2000);
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en la publicación",
          text: "Intentelo de nuevo",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
        });
      }
    },
    openModal(data) {
      if (isLoggedIn() === true) {
        this.modal = true;
      } else {
        Swal.fire({
          icon: "error",
          title: "No estas logeado!",
          text: "Logeate para publicar un viaje",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
        });
        this.$router.push("login");
      }
    },
    closeModal() {
      this.modal = false;
    }
  },
  watch: {
    filter: function() {
      if (this.filter === "date") {
        this.dateInput = true;
      } else {
        this.dateInput = false;
      }
    },
    spaces: function() {
      if (this.spaces.length < 1) {
        this.noResults = true;
      } else {
        this.noResults = false;
      }
    }
  },
  created() {
    this.getTrips();
  },
  computed: {}
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

/* GRID MODAL ADDTRIP */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}
.modalBox {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 30px 40px;
  width: 40%;
  height: 50%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 10% 10% 10% 17% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "localitylabel locality" "datelabel date" "categorylabel category" "budgetlabel budget" "descriptionlabel description" "buttonformadd buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.locality {
  grid-area: locality;
}

.localitylabel {
  grid-area: localitylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
  font-weight: bold;
}

.date {
  grid-area: date;
}

.datelabel {
  grid-area: datelabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
  font-weight: bold;
}

.category {
  grid-area: category;
}

.categorylabel {
  grid-area: categorylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
  font-weight: bold;
}

.budget {
  grid-area: budget;
}

.budgetlabel {
  grid-area: budgetlabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
  font-weight: bold;
}

.description {
  grid-area: description;
}

.descriptionlabel {
  grid-area: descriptionlabel;
  align-self: start;
  text-align: left;
  margin-left: 5rem;
  font-weight: bold;
}

textarea {
  resize: none;
}

.buttonformclose {
  grid-area: headerform;
  border: none;
  outline: none;
  cursor: pointer;
  align-self: start;
  justify-self: end;
  margin-bottom: 3rem;
  transition: 0.2s;
  opacity: 0.5;
  font-size: 25px;
}

.buttonformclose:hover {
  opacity: 1;
}

.buttonformadd {
  grid-area: buttonformadd;
  width: 7rem;
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

.buttonformadd:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.modalBox input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  margin-right: 1rem;
  font-size: 20px;
  color: white;
}

.modalBox textarea {
  margin-right: 1rem;
  height: 4rem;
}

input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  font-size: 20px;
  color: white;
  outline: none;
}

.newtrip {
  width: 7rem;
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
  margin-left: 2rem;
}

.newtrip:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.search {
  color: white;
  border: none;
  margin-left: 1rem;
  cursor: pointer;
  outline: none;
  font-size: 20px;
  transition: 0.2s;
  opacity: 0.5;
}

.search:hover {
  opacity: 1;
}

.tripscontainer select {
  width: 5rem;
  margin-right: 2rem;
  color: white;
  border-radius: 25px;
  background-color: #21212f;
}

/* TRIPSCONTAINER GRID */
.tripscontainer {
  align-items: center;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 5% 95%;
  grid-template-areas: "menu search" "menu trips";
  background-color: #1e1c2c;
  min-height: 100vh;
}
.menucustom {
  grid-area: menu;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.searchTrip {
  grid-area: search;
  text-align: center;
  background-color: #1e1c2c;
  position: fixed;
  margin-left: 11rem;
  width: 91%;
}

.searchTrip select {
  outline: none;
}

.trips {
  grid-area: trips;
}

h2 {
  text-align: center;
}

button {
  transition: 0.3s;
}

.roller {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
</style>