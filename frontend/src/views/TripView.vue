<template>
  <div class="trips">
    <vue-headful title="Viaje" description="Info del viaje" />
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
    <div class="tripcontainer">
      <menucustom class="menucustom"></menucustom>
      <showtrip
        class="showtrip"
        :trip="trip"
        :peopleJoin="peopleJoin"
        :allPeopleJoins="allPeopleJoins"
        v-show="!loading"
      ></showtrip>
      <section class="buttons" v-show="!loading">
        <button
          v-show="!getIds()"
          @click="CanIRate('Valorar')"
          :disabled="disablebutton"
        >Valorar host</button>
        <button v-show="!getIds()" :disabled="disablebutton" @click="CanIJoin('Apuntar')">Apuntate!</button>
      </section>
      <!-- MODAL PARA VALORAR -->
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <section class="ratemodal" v-show="ratemodal">
            <h3 class="headerform">Valorar host del viaje</h3>
            <label class="ratetextlabel" for="rate_text">Valoración:</label>
            <textarea
              class="ratetext"
              name="rate_text"
              placeholder="Escribe tu valoración sobre el host del viaje"
              v-model.trim="rate_text"
              rows="10"
              cols="50"
            />
            <label class="ratinglabel" for="rating">Score:</label>
            <star-rating v-model="rating" class="vote"></star-rating>
            <section class="buttonsform">
              <button class="buttonformclose" @click="closeModal()">Cancel</button>
              <button class="buttonformvote" @click="vote()">Enviar</button>
            </section>
          </section>
          <section class="joinmodal" v-show="joinmodal">
            <h3 class="headerformjoin">Dile al host porque quieres viajar con el</h3>
            <textarea
              class="messagejoin"
              v-model="messagejoin"
              name="message"
              placeholder="Escribe aqui..."
              rows="10"
              cols="50"
            />
            <section class="buttonsformjoin">
              <button class="buttonformclose" @click="closeModal()">Cancelar</button>
              <button class="buttonformvote" @click="sendRequestJoin()">Enviar</button>
            </section>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
import Swal from "sweetalert2";
import menucustom from "@/components/MenuCustom.vue";

//IMPORTANDO meetingS
import showtrip from "@/components/ShowTrip.vue";
export default {
  name: "TripView",
  components: { showtrip, StarRating, menucustom },
  props: ["id"],
  data() {
    return {
      trip: {},
      modal: false,
      rating: 0,
      rate_text: "",
      loading: true,
      ratemodal: false,
      joinmodal: false,
      messagejoin: "",
      peopleJoin: [],
      allPeopleJoins: [],
      disablebutton: false
    };
  },
  methods: {
    getIds() {
      if (this.trip.id_user) {
        this.id_host = this.trip.id_user;
        this.id_viewer = localStorage.getItem("userID");
        if (this.id_host.toString() === this.id_viewer) {
          return true;
        } else {
          return false;
        }
      }
    },
    async getPeople() {
      let self = this;
      await axios
        .get("http://localhost:3001/trips/join/" + self.$route.params.id)
        .then(function(response) {
          self.peopleJoin = response.data.data;
        })
        .catch(function(error) {
          if (error.response.data) {
            alert(error.response.data.message);
          }
        });
    },
    async getAllPeople() {
      let self = this;
      await axios
        .get("http://localhost:3001/trips/allJoins/" + self.$route.params.id)
        .then(function(response) {
          self.allPeopleJoins = response.data.data;
          console.log(self.allPeopleJoins);
          for (const join of self.allPeopleJoins) {
            if (join.id.toString() === localStorage.getItem("id")) {
              self.disablebutton = true;
            }
          }
        })
        .catch(function(error) {
          if (error.response.data) {
            alert(error.response.data.message);
          }
        });
    },
    CanIRate(data) {
      let fecha = new Date();
      if (fecha.getTime() >= Date.parse(this.trip.date)) {
        this.openModal(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "No ha sido posible.",
          text: "No puedes valorar al host de un viaje al que no asististe",
          confirmButtonText: "Ok"
        });
      }
    },
    CanIJoin(data) {
      let fecha = new Date();
      if (fecha.getTime() >= Date.parse(this.trip.date)) {
        Swal.fire({
          icon: "error",
          title: "No ha sido posible.",
          text: "No puedes apuntarte a un evento que ya ha ocurrido",
          confirmButtonText: "Ok"
        });
      } else {
        this.openModal(data);
      }
    },
    //FUNCION QUE ABRE EL POP UP PARA EDITAR
    openModal(data) {
      this.modal = true;
      if (data === "Valorar") {
        this.ratemodal = true;
      } else {
        this.joinmodal = true;
      }
    },
    //FUNCION QUE CIERRA EL POP UP PARA EDITAR
    closeModal() {
      this.modal = false;
      this.rating = 0;
      this.comentary = "";
      this.ratemodal = false;
      this.joinmodal = false;
    },
    getTrips() {
      let self = this;
      axios
        .get("http://localhost:3001/trips/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.trip = response.data.data;
            self.getAllPeople();
            self.getPeople();
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert("No existe esa meeting");
          }
        });
    },
    sendRequestJoin() {
      let self = this;
      axios
        .post("http://localhost:3001/trips/join/" + self.$route.params.id, {
          message: self.messagejoin
        })
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Petición enviada",
            text: "Gracias",
            confirmButtonText: "Ok"
          });
          self.closeModal();
          this.$router.push("trips");
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    vote() {
      let self = this;
      axios
        .post("http://localhost:3001/rating/" + self.$route.params.id, {
          points: self.rating,
          rate_text: self.rate_text,
          id: self.trip.id_user
        })
        .then(function(response) {
          console.log(response);
          self.emptyFields();
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    emptyFields() {
      this.rating = 0;
      this.rate_text = "";
      this.closeModal();
      Swal.fire({
        icon: "success",
        title: "Voto enviado",
        text: "Gracias",
        confirmButtonText: "Ok"
      });
      setTimeout(function() {
        location.reload();
      }, 1500);
    }
  },
  created() {
    this.getTrips();
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
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
  padding: 50px;
  width: 40%;
  height: 50%;
  color: white;
}

.ratemodal {
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: minmax(30px, auto);
  gap: 10px 10px;
  grid-template-areas: "headerform" "ratetextlabel" "ratetext" "ratinglabel" "vote" "buttonsform";
}

.headerform {
  grid-area: headerform;
  text-align: center;
}

.ratetextlabel {
  grid-area: ratetextlabel;
  text-align: center;
}

.ratetext {
  grid-area: ratetext;
  align-self: center;
}

.ratinglabel {
  grid-area: ratinglabel;
  text-align: center;
}

.vote {
  grid-area: vote;
  align-self: center;
  margin-left: 13rem;
}

.buttonsform {
  grid-area: buttonsform;
  align-self: end;
  justify-self: center;
}

.buttonformclose {
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

.buttonformvote {
  width: 28rem;
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

.joinmodal {
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: minmax(30px, auto);
  gap: 10px 10px;
  grid-template-areas: "headerformjoin" "messagejoin" "buttonsformjoin";
}

.headerformjoin {
  grid-area: headerformjoin;
  text-align: center;
}

.messagejoin {
  grid-area: messagejoin;
  align-self: center;
}

.buttonsformjoin {
  grid-area: buttonsformjoin;
}

.menucustom {
  grid-area: menu;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.tripcontainer {
  background-color: #1e1c2c;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 90% 10%;
  grid-template-areas: "menu trip" "menu buttons";
  background-size: cover;
}

.menucustom {
  grid-area: menu;
  min-height: 100%;
}

.showtrip {
  grid-area: trip;
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: #151521;
  min-height: 94vh;
}

.buttons {
  grid-area: buttons;
  background-color: #151521;
  display: flex;

  justify-content: center;
  align-content: center;
}

.buttons button {
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
}

.buttons button:hover {
  background: #ffaa00;
}

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