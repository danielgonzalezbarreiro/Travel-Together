<template>
  <div class="trips">
    <vue-headful title="Viaje" description="Info del viaje" />
    <!--  SIMBOLO DE CARGA  -->
    <roller class="roller" v-show="loading"></roller>

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

      <footercustom class="footercustom"></footercustom>

      <!-- MODAL PARA VALORAR -->
      <transition name="fade">
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
              <button class="buttonformclose1" @click="closeModal()">
                <font-awesome-icon class="icon" icon="times" />
              </button>
              <button class="buttonformvote" @click="vote()">Enviar</button>
            </section>

            <section class="joinmodal" v-show="joinmodal">
              <h3 class="headerformjoin">Dile al host porque quieres viajar con el</h3>
              <textarea
                class="messagejoin"
                v-model="messagejoin"
                name="message"
                placeholder="Escribe aqui..."
                rows="5"
                cols="5"
              />
              <button class="buttonformclose" @click="closeModal()">
                <font-awesome-icon class="icon" icon="times" />
              </button>
              <button class="buttonformjoin" @click="sendRequestJoin()">Enviar</button>
            </section>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
import Swal from "sweetalert2";
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

import roller from "@/components/RollerComponent.vue";

import showtrip from "@/components/trips/ShowTrip.vue";
export default {
  name: "TripView",
  components: { showtrip, StarRating, menucustom, roller, footercustom },
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
          confirmButtonText: "Ok",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
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
          confirmButtonText: "Ok",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
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
            console.log("trips", self.trip);
            self.getAllPeople();
            self.getPeople();
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert("No existe ese viaje");
          }
        });
    },
    sendRequestJoin() {
      let self = this;
      axios
        .post("http://localhost:3001/trips/join/" + self.$route.params.id, {
          join_message: self.messagejoin
        })
        .then(function(response) {
          Swal.fire({
            icon: "success",
            title: "Petición enviada",
            text: "Gracias",
            confirmButtonText: "Ok",
            background: "#1e1c2c",
            confirmButtonColor: "#ff6d00"
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
        confirmButtonText: "Ok",
        background: "#1e1c2c",
        confirmButtonColor: "#ff6d00"
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* RATE MODAL GRID */

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
}

.ratemodal {
  display: grid;
  grid-template-columns: 30% 70%;
  grid-auto-rows: 20% 40% 28% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform " "ratetextlabel ratetext" "ratinglabel vote" "buttonformvote buttonformvote";
}

textarea {
  resize: none;
  width: 400px;
}

.headerform {
  grid-area: headerform;
  text-align: center;
  align-self: center;
  font-size: 26px;
}

.ratetextlabel {
  grid-area: ratetextlabel;
  text-align: center;
  font-weight: bold;
}

.ratetext {
  grid-area: ratetext;
  align-self: center;
}

.ratinglabel {
  grid-area: ratinglabel;
  text-align: center;
  align-self: center;
  font-weight: bold;
}

.vote {
  grid-area: vote;
  align-self: center;
  justify-self: start;
  margin-left: 3rem;
}

.buttonformvote {
  grid-area: buttonformvote;
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

.buttonformvote:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.buttonformclose1 {
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

.buttonformclose1:hover {
  opacity: 1;
}

/* JOIN MODAL GRID */

.joinmodal {
  background: #1e1c2c;
  margin: auto;
  width: 100%;
  height: 100%;
  color: white;
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: 20% 60% 20%;
  gap: 10px 10px;
  grid-template-areas: "headerformjoin headerformjoin" "messagejoin messagejoin" "buttonformjoin buttonformjoin";
}

.headerformjoin {
  grid-area: headerformjoin;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.messagejoin {
  grid-area: messagejoin;
  align-self: start;
  justify-self: center;
  width: 600px;
}

.messagejoin textarea {
  width: 630px;
}

.buttonformjoin {
  grid-area: buttonformjoin;
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

.buttonformjoin:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.buttonformclose {
  grid-area: headerformjoin;
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

.menucustom {
  grid-area: menu;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

/* TRIP CONTAINER GRID */
.tripcontainer {
  background-color: #0f0e1d;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 80% 5% 20%;
  grid-template-areas: "menu trip" "menu buttons" "menu .";
  background-size: cover;
  height: 100vh;
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
  background-color: #0f0e1d;
  min-height: 94vh;
}

.buttons {
  grid-area: buttons;
  background-color: #0f0e1d;
  display: flex;
  justify-content: center;
  align-self: center;
}

.buttons button {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 0.667rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  transition: 0.3s;
  outline: none;
}

.buttons button:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.roller {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.footercustom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
}
</style>