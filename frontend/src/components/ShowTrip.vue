<template>
  <div>
    <div class="showtripcontainer">
      <figure class="profile">
        <img
          class="profileavatar"
          :src="trip.avatar_img ? path + trip.avatar_img : defaultAvatar"
          alt
        />
        <router-link
          class="profilename"
          :to=" {name:'Profile', params:{id:trip.id_user ? trip.id_user : 0}} "
        >{{trip.profile_name}}</router-link>
      </figure>
      <div class="locality">
        <font-awesome-icon class="icon" icon="route" />
        {{ trip.locality }}
      </div>
      <div class="category">
        <font-awesome-icon class="icon" icon="star" />
        {{ trip.category }}
      </div>
      <div class="date">
        <font-awesome-icon class="icon" icon="calendar-alt" />
        {{ trip.date ? trip.date.substr(0,10) :'' }}
      </div>
      <div class="description">
        <font-awesome-icon class="icon" icon="file" />
        {{ trip.description }}
      </div>
      <div class="budget">
        <font-awesome-icon class="icon" icon="money-bill-alt" />
        {{ trip.budget }}
      </div>
      <div class="users">
        <font-awesome-icon class="icon" icon="user" />
        {{ peopleJoin.length }}
      </div>
      <br />
      <section class="editbutton" v-show="getIds()">
        <button @click="openModal()">Modificar viaje</button>
        <button @click="openModalinfo()">Usuarios</button>
      </section>

      <!-- modalbox -->

      <div class="modalinfo" v-show="modalinfo">
        <section
          class="modalBoxInfo"
          v-show="getIds()"
          v-for="join in allPeopleJoins"
          :key="join.id_user"
        >
          <p>Usuario: {{ join.user_login }}</p>
          <p>Admitido: {{ join.user_admitted ? 'yes' : 'no' }}</p>
          <p>{{ join.user_admitted ? null : join.join_message }}</p>
          <button
            v-show="join.user_admitted===0"
            @click="letJoin(join.id_user, join.id_travel)"
          >Aceptar</button>
          <button @click="closeModalinfo()">Cerrar</button>
        </section>
      </div>
      <!-- MODAL PARA EDITAR -->
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Modificar viaje:</h2>

          <label class="localitylabel" for="locality">Locality:</label>
          <input class="localityform" name="locality" v-model="locality" />

          <label class="datelabel" for="trip-date">Elije la fecha de tu evento:</label>
          <input
            class="dateform"
            required
            type="date"
            id="trip-date"
            name="trip-date"
            :min="fechaminimo"
            :max="fechamaximo"
            v-model="trip_date"
          />

          <label class="categorylabel" for="category">Categoria:</label>
          <input
            class="categoryform"
            v-model="category"
            placeholder="Introduce la categoria de tu viaje"
          />

          <label class="budgetlabel" for="budget">Presupuesto:</label>
          <input
            class="budgetform"
            v-model="budget"
            placeholder="Introduce el presupuesto estimado de tu viaje"
          />

          <label class="descriptionlabel" for="description">Description:</label>
          <input
            class="decriptionform"
            v-model="description"
            placeholder="Introduce una descripcion de tu viaje"
          />

          <button class="buttonformclose" @click="closeModal()">Cancel</button>
          <button class="buttonformadd" @click="edite()">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { getUserName } from "../api/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faRoute,
  faCalendarAlt,
  faMoneyBillAlt,
  faUser,
  faStar
} from "@fortawesome/free-solid-svg-icons";

library.add(faFile, faRoute, faCalendarAlt, faMoneyBillAlt, faUser, faStar);

export default {
  name: "MeetingView",
  data() {
    return {
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      trip_date: "",
      locality: "",
      category: "",
      budget: "",
      description: "",
      userName: "",
      id_host: 0,
      id_viewer: "",
      isHost: false,
      modal: false,
      modalinfo: false,
      fechamaximo: "",
      fechaminimo: ""
    };
  },
  props: {
    peopleJoin: Array,
    trip: Object,
    allPeopleJoins: Array
  },
  methods: {
    letJoin(id, id_travel) {
      let self = this;
      axios
        .put(`http://localhost:3001/trips/join/` + id_travel, {
          id_user_join: id
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getIds() {
      if (this.trip.id_user) {
        this.id_host = this.trip.id_user;
        this.userNameFunction(this.id_host);
        this.id_viewer = localStorage.getItem("userID");
        if (this.id_host.toString() === this.id_viewer) {
          return true;
        } else {
          return false;
        }
      }
    },

    setFechaMinimoYMaximo() {
      let dateToday = new Date();
      this.fechaminimo = dateToday.toISOString().slice(0, 16);
      var date = new Date();
      date.setDate(date.getDate() + 31);
      this.fechamaximo = date.toISOString().slice(0, 16);
    },
    closeModal() {
      this.modal = false;
    },
    edite() {
      let self = this;
      axios
        .put("http://localhost:3001/trips/" + this.trip.id, {
          locality: this.locality,
          date: this.trip_date,
          category: this.category,
          budget: this.budget,
          description: this.description
        })
        .then(function(response) {
          self.closeModal();
          Swal.fire({
            icon: "success",
            title: "Perfil modificado",
            confirmButtonText: "Ok"
          });
          setTimeout(function() {
            location.reload();
          }, 1500);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    async userNameFunction(id) {
      try {
        const userName = await getUserName(id);
        this.userName = userName;
        return userName;
      } catch (error) {
        alert(error);
      }
    },
    saveDataToModal() {
      this.locality = this.trip.locality;
      this.date = this.trip.date.slice(0, 16);
      (this.category = this.trip.category),
        (this.budget = this.trip.budget),
        (this.description = this.trip.description);
    },
    openModal(data) {
      this.saveDataToModal();
      this.modal = true;
    },
    openModalinfo() {
      this.modalinfo = true;
    },
    closeModal() {
      this.modal = false;
    },
    closeModalinfo() {
      this.modalinfo = false;
    },
    mounted() {
      this.setFechaMinimoYMaximo();
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

.modalinfo {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.modalBoxinfo {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 50px;
  width: 40%;
  height: 40%;
  color: white;
}

/* modal grid edit */
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
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 10% 10% 10% 10% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "localitylabel localityform" "datelabel dateform" "categorylabel categoryform" "budgetlabel budgetform" "descriptionlabel descriptionform" "buttonformclose buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
}

.localityform {
  grid-area: localityform;
}

.localitylabel {
  grid-area: localitylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.dateform {
  grid-area: dateform;
}

.datelabel {
  grid-area: datelabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.categoryform {
  grid-area: categoryform;
}

.categorylabel {
  grid-area: categorylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.budgetform {
  grid-area: budgetform;
}

.budgetlabel {
  grid-area: budgetlabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.descriptionform {
  grid-area: descriptionform;
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
  justify-self: right;
}

.buttonformadd {
  grid-area: buttonformadd;
  width: 33rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
}

.modalBox input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  font-size: 20px;
  color: white;
}
/* showtripcontainer grid */

.showtripcontainer {
  background-color: #1e1c2c;
  color: white;
  height: 40rem;
  border-radius: 25px;
  width: 40rem;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 20% 20% 30% 10% 10%;
  grid-template-areas: "profile profile profile" "locality category date" "description description description" "budget . users" "editbutton editbutton editbutton";
}
.showtripcontainer > div {
  text-align: center;
  align-self: center;
  justify-self: center;
  font-size: 20px;
}

.showtripcontainer > div,
figure {
  background-color: #1e1c2c;
}

.joinaccept {
  grid-area: joinaccept;
}

.profile {
  grid-area: profile;
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
}

.profilename {
  text-decoration: none;
  background-color: #1e1c2c;
}

.locality {
  grid-area: locality;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category {
  grid-area: category;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date {
  grid-area: date;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.description {
  grid-area: description;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.budget {
  grid-area: budget;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.users {
  grid-area: users;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.editbutton {
  grid-area: editbutton;
  background-color: #1e1c2c;
  margin: 0 auto;
}

.editbutton button {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
}
.profileavatar {
  grid-area: profileavatar;
  width: 100px;
  height: 100px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  justify-content: center;
}

/* roller */

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