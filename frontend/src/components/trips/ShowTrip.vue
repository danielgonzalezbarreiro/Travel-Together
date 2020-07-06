<template>
  <div>
    <div class="showtripcontainer">
      <div class="profileview">
        <img :src="trip.avatar_img ? path + trip.avatar_img : defaultAvatar" alt />
        <router-link
          :to=" {name:'Profile', params:{id:trip.id_user ? trip.id_user : 0}} "
        >{{trip.profile_name}}</router-link>
        <p>{{'@'+ trip.user_login}}</p>
      </div>

      <figure class="localitylabelview">
        <font-awesome-icon class="icon" icon="route" />
        <p>Destino</p>
      </figure>
      <div class="localityview">{{ trip.locality }}</div>

      <figure class="categorylabelview">
        <font-awesome-icon class="icon" icon="star" />
        <p>Categoria</p>
      </figure>
      <div class="categoryview">{{ trip.category }}</div>

      <figure class="datelabelview">
        <font-awesome-icon class="icon" icon="calendar-alt" />
        <p>Fecha</p>
      </figure>
      <div class="dateview">{{ trip.date ? trip.date.substr(0,10) :'' }}</div>

      <figure class="descriptionlabelview">
        <font-awesome-icon class="icon" icon="file" />
        <p>Descripción del viaje</p>
      </figure>
      <div class="descriptionview">{{ trip.description }}</div>

      <figure class="budgetlabelview">
        <font-awesome-icon class="icon" icon="money-bill-alt" />
      </figure>
      <div class="budgetview">{{ trip.budget + '€' }}</div>

      <figure class="userslabelview">
        <button @click="openModalinfo()">
          <font-awesome-icon class="icon" icon="user" />
        </button>
      </figure>
      <div class="usersview">{{ peopleJoin.length }}</div>

      <section class="editbuttonview" v-show="getIds()">
        <button @click="openModal()">
          <font-awesome-icon class="icon" icon="edit" />
        </button>
      </section>
    </div>
    <!-- modalbox -->
    <transition name="fade">
      <div class="modalinfo" v-show="modalinfo">
        <div class="modalBoxInfo">
          <header class="joinheader">
            <h3>Usuario</h3>
            <h3>Mensaje</h3>
            <h3>Admitido</h3>
          </header>
          <div
            class="joincontainer"
            v-show="getIds()"
            v-for="join in allPeopleJoins"
            :key="join.id_user"
          >
            <section class="usersjoin">
              <p>{{ "@" + join.user_login }}</p>
            </section>

            <section class="joinmessage">
              <p>{{join.join_message }}</p>
            </section>

            <section class="useradmitted">
              <p>{{ join.user_admitted ? 'Si' : 'No' }}</p>
            </section>
            <button
              class="joinbutton"
              v-show="join.user_admitted===0"
              @click="letJoin(join.id_user, join.id_travel)"
            >
              <font-awesome-icon class="icon" icon="user-check" />
            </button>
            <button
              class="joinbutton"
              v-show="join.user_admitted===1"
              @click="deleteJoin(join.id_user, join.id_travel)"
            >
              <font-awesome-icon class="icon" icon="user-times" />
            </button>
          </div>
          <button class="closejoinbutton" @click="closeModalinfo()">Cerrar</button>
        </div>
      </div>
    </transition>
    <!-- MODAL PARA EDITAR -->
    <transition name="fade">
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Modificar viaje:</h2>

          <label class="localitylabel" for="locality">Locality:</label>
          <input class="localityform" name="locality" v-model="locality" />

          <label class="datelabel" for="trip-date">Fecha del Viaje:</label>
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
          <textarea
            class="decriptionform"
            v-model="description"
            name="description"
            placeholder="Introduce una descripcion de tu viaje"
            rows="40"
            cols="40"
          />

          <button class="buttonformclose" @click="closeModal()">
            <font-awesome-icon class="icon" icon="times" />
          </button>
          <button class="buttonformadd" @click="edite()">Enviar</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { getUserName } from "../../api/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faRoute,
  faCalendarAlt,
  faMoneyBillAlt,
  faUser,
  faStar,
  faUserTimes,
  faUserCheck,
  faCheck,
  faTimes,
  faEdit
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faFile,
  faRoute,
  faCalendarAlt,
  faMoneyBillAlt,
  faUser,
  faStar,
  faUserTimes,
  faUserCheck,
  faCheck,
  faTimes,
  faEdit
);

export default {
  name: "ShowTrip",
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
          location.reload();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    deleteJoin(id, id_travel) {
      let self = this;
      axios
        .delete(`http://localhost:3001/trips/join/` + id_travel, {
          data: {
            id_user_join: id
          }
        })
        .then(function(response) {
          console.log(response);
          location.reload();
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
            title: "Viaje modificado",
            confirmButtonText: "Ok",
            background: "#1e1c2c",
            confirmButtonColor: "#ff6d00"
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* MODAL USUARIOS */
.modalinfo {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.modalBoxInfo {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 50px;
  width: 40%;
  height: 50%;
  color: white;
}

.joinheader {
  grid-area: joinheader;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: 100%;
  padding: 0.25rem 0;
}

.joinheader h3 {
  justify-self: center;
}

.joincontainer {
  grid-area: joincontainer;
  display: grid;
  margin-top: 0.5rem;
  grid-template-columns: 20% 60% 20% 5%;
  grid-template-rows: 100%;
  grid-template-areas: "usersjoin joinmessage useradmitted joinbutton";
}

.closejoinbutton {
  grid-area: closejoinbutton;
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
  align-self: center;
  justify-self: center;
  outline: none;
  margin-left: 18rem;
}

.usersjoin {
  grid-area: usersjoin;
  text-align: center;
}

.joinmessage {
  grid-area: joinmessage;
  text-align: center;
}

.useradmitted {
  grid-area: useradmitted;
  text-align: center;
}

.joinbutton {
  grid-area: joinbutton;
  font-size: 18px;
  border: none;
  align-self: start;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}

.joinbutton:hover {
  font-size: 20px;
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
  padding: 30px 40px;
  width: 40%;
  height: 50%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 10% 10% 10% 17% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "localitylabel localityform" "datelabel dateform" "categorylabel categoryform" "budgetlabel budgetform" "descriptionlabel descriptionform" "buttonformadd buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  align-self: center;
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
  align-self: start;
  text-align: left;
  margin-left: 5rem;
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
  margin-right: 2rem;
  padding: 0.3rem;
  font-size: 20px;
  color: white;
}

.modalBox textarea {
  margin-right: 2rem;
  height: 4rem;
}
/* showtripcontainer grid */

.showtripcontainer {
  font-size: 20px;
  margin: 2rem;
  background-color: #1e1c2c;
  border-radius: 25px;
  color: white;
  height: 40rem;
  width: 52rem;
  display: grid;
  grid-template-columns: 30% 23% 23% 23%;
  grid-template-rows: 10% 10% 5% 10% 15% 20% 10% 10% 5%;
  gap: 1px 1px;
  grid-template-areas: "profileview localitylabelview . datelabelview" "profileview localityview . dateview" "profileview . categorylabelview ." "profileview . categoryview ." "descriptionlabelview descriptionlabelview descriptionlabelview descriptionlabelview" "descriptionview descriptionview descriptionview descriptionview" "budgetlabelview . . userslabelview" "budgetview . . usersview" "editbuttonview editbuttonview editbuttonview editbuttonview";
}
.icon {
  font-size: 24px;
}

p {
  margin-left: 0.5rem;
}
.profileview {
  grid-area: profileview;
  justify-self: center;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  align-self: center;
}

.profileview a {
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
}

.profileview a:hover {
  font-weight: normal;
}

.profileview p {
  font-style: italic;
  margin: 0;
  align-self: center;
  color: gray;
  font-size: 16px;
}

.localitylabelview {
  grid-area: localitylabelview;
  justify-self: center;
  display: flex;
  align-self: end;
}

.localityview {
  grid-area: localityview;
  justify-self: center;
  margin-top: 0.5rem;
  color: #ffaa00;
  text-align: center;
}

.datelabelview {
  grid-area: datelabelview;
  justify-self: center;
  display: flex;
  align-self: end;
}

.dateview {
  grid-area: dateview;
  justify-self: center;
  margin-top: 0.5rem;
  color: #ffaa00;
}

.categorylabelview {
  grid-area: categorylabelview;
  justify-self: center;
  display: flex;
  align-self: center;
}

.categoryview {
  grid-area: categoryview;
  justify-self: center;
  color: #ffaa00;
}

.descriptionlabelview {
  grid-area: descriptionlabelview;
  justify-self: center;
  display: flex;
  align-self: center;
}

.descriptionview {
  grid-area: descriptionview;
  justify-self: center;
  color: #ffaa00;
  font-style: italic;
  text-align: center;
  margin: 0 2rem;
}

.budgetlabelview {
  grid-area: budgetlabelview;
  justify-self: center;
  align-self: end;
}

.budgetview {
  grid-area: budgetview;
  justify-self: center;
  margin-top: 0.5rem;
  color: #ffaa00;
}

.userslabelview {
  grid-area: userslabelview;
  justify-self: center;
  align-self: end;
}

.userslabelview button {
  border: none;
  outline: none;
  cursor: pointer;
  align-self: start;
  margin-top: 0.5rem;
  justify-self: center;
  transition: 0.2s;
  opacity: 0.5;
}

.userslabelview button:hover {
  opacity: 1;
}

.usersview {
  grid-area: usersview;
  justify-self: center;
  margin-top: 0.5rem;
  color: #ffaa00;
}

.editbuttonview {
  grid-area: editbuttonview;
  justify-self: center;
  align-self: center;
}

.editbuttonview button {
  width: 7rem;
  border: none;
  outline: none;
  cursor: pointer;
  align-self: start;
  margin-top: 0.5rem;
  justify-self: center;
  font-size: 25px;
  transition: 0.2s;
  opacity: 0.5;
}

.editbuttonview button:hover {
  opacity: 1;
}

.profileview img {
  width: 120px;
  height: 120px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  margin: 1rem auto;
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