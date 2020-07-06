<template>
  <div class="photos">
    <vue-headful title="Foto" description="Vista de la foto" />
    <!--  SIMBOLO DE CARGA  -->
    <roller class="roller" v-show="loading"></roller>
    <footercustom class="footercustom"></footercustom>
    <menucustom class="menucustom"></menucustom>

    <div class="photocontainer">
      <showphoto class="showphoto" :photo="photo" v-show="!loading"></showphoto>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
import Swal from "sweetalert2";
import menucustom from "@/components/MenuCustom.vue";
import roller from "@/components/RollerComponent.vue";
import footercustom from "@/components/FooterCustom.vue";
import showphoto from "@/components/reel/ShowPhoto.vue";
export default {
  name: "PhotoView",
  components: { showphoto, StarRating, menucustom, roller, footercustom },
  props: ["id"],
  data() {
    return {
      photo: {},
      modal: false,
      loading: true
    };
  },
  methods: {
    getIds() {
      if (this.photo.id_user) {
        this.id_host = this.trip.id_user;
        this.id_viewer = localStorage.getItem("userID");
        if (this.id_host.toString() === this.id_viewer) {
          return true;
        } else {
          return false;
        }
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
    getPhotos() {
      let self = this;
      axios
        .get("http://localhost:3001/reel/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.photo = response.data.data;
            console.log("photo", self.photo);
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert("No existe ese viaje");
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
    this.getPhotos();
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

.photocontainer {
  background-color: #1e1c2c;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 100%;
  grid-template-areas: "menucustom showphoto";
  background-size: cover;
}

.menucustom {
  grid-area: menucustom;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
  min-height: 100%;
}

.showphoto {
  grid-area: showphoto;
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
  transition: 0.3s;
  outline: none;
}

.buttons button:hover {
  background: #ffaa00;
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