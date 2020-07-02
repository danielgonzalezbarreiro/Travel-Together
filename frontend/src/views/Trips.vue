<template>
  <div>
    <vue-headful title="Trips" description="Viajes" />

    <div class="tripscontainer">
      <menucustom class="menucustom"></menucustom>
      <!--  SIMBOLO DE CARGA  -->
      <div v-show="loading" class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div v-show="!loading" class="searchTrip">
        <select v-model="filter">
          <option disabled value>Filtrado por...</option>
          <option value="locality">Locality</option>
          <option value="date">Datas</option>
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
      <!-- MODAL PARA AÑADIR TRIP -->
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Añadir viaje</h2>
          <label class="localitylabel" for="locality">Ubicacion:</label>
          <input class="locality" v-model="locality" placeholder="Introduce el destino de tu viaje" />

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

          <label class="descriptionlabel" for="description">Description:</label>
          <input
            class="description"
            v-model="description"
            placeholder="Introduce una descripcion de tu viaje"
          />

          <button class="buttonformadd" @click="addTrip(), closeModal()">Add</button>
          <button class="buttonformclose" @click="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import showtripslist from "@/components/ShowTripsList.vue";
import menucustom from "@/components/MenuCustom.vue";
import { isLoggedIn } from "../api/utils.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

library.add(faSearch);

export default {
  name: "Trips",
  components: {
    showtripslist,
    menucustom
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
      required: false
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
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
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
              text: "Disfruta de tu viaje!"
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
          text: "Intentelo de nuevo"
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
          text: "Logeate para publicar un viaje"
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
  padding: 50px;
  width: 40%;
  height: 50%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 10% 10% 10% 10% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "localitylabel locality" "datelabel date" "categorylabel category" "budgetlabel budget" "descriptionlabel description" "buttonformclose buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
}

.locality {
  grid-area: locality;
}

.localitylabel {
  grid-area: localitylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.date {
  grid-area: date;
}

.datelabel {
  grid-area: datelabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.category {
  grid-area: category;
}

.categorylabel {
  grid-area: categorylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.budget {
  grid-area: budget;
}

.budgetlabel {
  grid-area: budgetlabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.description {
  grid-area: description;
}

.descriptionlabel {
  grid-area: descriptionlabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.buttonformclose {
  grid-area: buttonformclose;
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: black;
  background: white;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
  outline: none;
}

.buttonformadd {
  grid-area: buttonformadd;
  width: 28rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  margin-left: 0.1rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
  outline: none;
}

.buttonformadd:hover {
  background-color: #c0440f;
}

.modalBox input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  margin-right: 1rem;
  font-size: 20px;
  color: white;
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
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 0.667rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  margin-left: 2rem;
  outline: none;
}

.newtrip:hover {
  background: #c0440f;
}

.search {
  color: white;
  border: none;
  margin-left: 1rem;
}

.icon {
  font-size: 18px;
  cursor: pointer;
}

.icon:hover {
  font-size: 19px;
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
  margin-left: 10rem;
  width: 90%;
}
.trips {
  grid-area: trips;
}

/* ROLLER CSS */

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: cadetblue;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>