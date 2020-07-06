<template>
  <div>
    <vue-headful title="Reel" description="Reel" />

    <div class="reelcontainer">
      <menucustom class="menucustom"></menucustom>
      <!--  SIMBOLO DE CARGA  -->
      <roller class="roller" v-show="loading"></roller>

      <button class="uploadphoto" @click="openModal()">
        <font-awesome-icon class="icon" icon="upload" />
      </button>

      <showreellist class="reel" :reel="reel"></showreellist>

      <!-- MODAL UPLOAD PHOTO -->
      <transition name="fade">
        <div class="modal" v-show="modal">
          <div class="modalBox">
            <h2 class="headerform">Subir Foto</h2>

            <label class="photofilelabel" for="photofile">Foto:</label>
            <input class="photofile" type="file" id="file" ref="file" @change="handleFileUpload" />

            <label class="phototextlabel" for="phototext">Descripcion:</label>
            <textarea
              class="phototext"
              v-model="photo_text"
              name="phototext"
              placeholder="Escribe un pie de foto..."
              rows="20"
              cols="20"
            />

            <button class="buttonformadd" @click=" closeModal(), addPhoto()">Subir foto</button>
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
import showreellist from "@/components/reel/ShowReelList.vue";
import menucustom from "@/components/MenuCustom.vue";
import roller from "@/components/RollerComponent.vue";

import { isLoggedIn } from "../../api/utils.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faUpload, faTimes);

export default {
  name: "Reel",
  components: {
    menucustom,
    showreellist,
    roller
  },
  data() {
    return {
      reel: [],
      file: null,
      photo_text: "",
      errorMsg: "Error",
      modal: false,
      loading: true,
      correctData: false,
      required: false
    };
  },
  methods: {
    getReel() {
      let self = this;
      axios
        .get("http://localhost:3001/reel")
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.reel = response.data.data;
            console.log(self.reel);
          }, 1000);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    errorNotification(msg) {
      this.errorMsg = msg;
      this.correctData = false; // NON ENVIAR
      this.required = true; // MOSTRA O MENSAXE

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${this.errorMsg}`,
        background: "#1e1c2c",
        confirmButtonColor: "#ff6d00"
      });
    },
    validatingData() {
      if (this.file === "") {
        this.errorNotification("Por favor cubre todos los campos");
        return;
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    addPhoto() {
      this.validatingData();
      if (this.correctData === true) {
        console.log("xd");
        let self = this;
        let photoFormData = new FormData();
        // dict of all elements
        photoFormData.append("photo_text", this.photo_text);
        if (this.file != null) {
          photoFormData.append("photo", this.file);
        }
        axios
          .post("http://localhost:3001/reel", photoFormData)
          .then(function(response) {
            //self.emptyFields();
            Swal.fire({
              icon: "success",
              title: "Foto publicada!",
              text: "",
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
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    openModal(data) {
      if (isLoggedIn() === true) {
        this.modal = true;
      } else {
        Swal.fire({
          icon: "error",
          title: "No estas logeado!",
          text: "Logeate para publicar una foto",
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
  watch: {},
  created() {
    this.getReel();
  },
  computed: {}
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

/* MODAL BOX UPLOAD PHOTO */
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
  font-size: 20px;
  background: #1e1c2c;
  margin: 10% auto;
  padding: 30px 40px;
  width: 40%;
  height: 50%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 50% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "photofilelabel photofile" "phototextlabel phototext" "buttonformadd buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  align-self: center;
  font-size: 26px;
}

.photofile {
  grid-area: photofile;
  justify-self: center;
  align-self: center;
}

.photofilelabel {
  grid-area: photofilelabel;
  align-self: center;
  text-align: center;
  margin-left: 4rem;
  font-weight: bold;
}

.phototext {
  grid-area: phototext;
  margin-top: 1.5rem;
}

.phototextlabel {
  grid-area: phototextlabel;
  align-self: start;
  justify-self: center;
  margin-top: 1.5rem;
  font-weight: bold;
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

.modalBoxAvatar input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  margin-right: 2rem;
  padding: 0.3rem;
  height: 2.5rem;
  font-size: 20px;
  color: white;
  align-self: center;
}

textarea {
  resize: none;
  height: 100px;
  width: 420px;
}

/* REEL CONTAINER */

.reelcontainer {
  align-items: center;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 4% 95%;
  grid-template-areas: "menu uploadphoto" "menu reel";
  background-color: #1e1c2c;
  min-height: 100vh;
}
.menucustom {
  grid-area: menu;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.uploadphoto {
  grid-area: uploadphoto;
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

.uploadphoto:hover {
  opacity: 1;
}

.reel {
  grid-area: reel;
}

h2 {
  text-align: center;
}

.roller {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
</style>