<template>
  <div>
    <div class="showphotocontainer">
      <figure class="profile">
        <img :src="photo.avatar_img ? path + photo.avatar_img : defaultAvatar" alt />
        <nav>
          <router-link
            id="link"
            :to="{ name: 'Profile', params:{ id: photo.user_id }}"
          >{{ photo.profile_name }}</router-link>
          <p>{{'@' + photo.user_login}}</p>
        </nav>
      </figure>

      <div class="photodate">{{photo.create_photo.substr(0,10)}}</div>

      <figure class="photo">
        <img :src="path + photo.photo" alt />
      </figure>

      <section class="phototext">
        <p>{{'@' + photo.user_login + ':'}}</p>
        {{photo.text}}
      </section>

      <section class="editbutton" v-show="getIds()">
        <button @click="openModal()">
          <font-awesome-icon class="icon" icon="edit" />
        </button>
      </section>
    </div>

    <!-- MODAL PARA EDITAR -->
    <transition name="fade">
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Modificar pie de foto:</h2>

          <label class="phototextlabel" for="phototext">Descripción:</label>
          <textarea
            class="phototext"
            v-model="photo_text"
            name="phototext"
            placeholder="Escribe un pie de foto..."
            rows="10"
            cols="53"
          />

          <button class="deletebutton" @click="deletePhoto(), closeModal()">
            <font-awesome-icon class="icon" icon="trash" />
          </button>

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
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faEdit, faTrash, faTimes);

export default {
  name: "ShowPhoto",
  data() {
    return {
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      photo_text: "",
      userName: "",
      id_host: 0,
      id_viewer: "",
      isHost: false,
      modal: false
    };
  },
  props: {
    photo: Object
  },
  methods: {
    getIds() {
      if (this.photo.user_id) {
        this.id_host = this.photo.user_id;
        this.userNameFunction(this.id_host);
        this.id_viewer = localStorage.getItem("userID");
        if (this.id_host.toString() === this.id_viewer) {
          return true;
        } else {
          return false;
        }
      }
    },
    edite() {
      let self = this;
      axios
        .put("http://localhost:3001/reel/" + self.photo.id, {
          photo_text: self.photo_text
        })
        .then(function(response) {
          self.closeModal();
          Swal.fire({
            icon: "success",
            title: "Publicacion modificada!",
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
    deletePhoto() {
      let self = this;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        background: "#1e1c2c",
        confirmButtonColor: "#ff6d00"
      }).then(result => {
        if (result.value) {
          axios
            .delete(`http://localhost:3001/reel/` + self.photo.id, {
              data: {}
            })
            .then(function(response) {
              console.log(response);
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                background: "#1e1c2c",
                confirmButtonColor: "#ff6d00"
              });
              self.$router.push({ path: "/reel" });
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },
    saveDataToModal() {
      this.photo_text = this.photo.text;
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
    openModal(data) {
      this.saveDataToModal();
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}
/* MODAL BOX EDIT PHOTO */
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
  grid-template-rows: 20% 30% 34% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "phototextlabel phototext" "deletebutton deletebutton" "buttonformadd buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.phototext {
  grid-area: phototext;
}

.phototextlabel {
  grid-area: phototextlabel;
  align-self: start;
  justify-self: center;
}

.deletebutton {
  grid-area: deletebutton;
  justify-self: center;
  align-self: end;
}

.deletebutton {
  border: none;
  outline: none;
  cursor: pointer;
  margin-bottom: 1rem;
  justify-self: center;
  font-size: 20px;
  transition: 0.2s;
  opacity: 0.5;
}

.deletebutton:hover {
  opacity: 1;
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
}

/* PHOTO GRID CONTAINER */
.showphotocontainer {
  width: 650px;
  height: 600px;
  margin: 0 auto;
  margin-top: 1rem;
  padding: 0.25rem;
  background-color: #1e1c2c;
  color: white;
  border-radius: 25px;
  justify-self: center;
  align-self: center;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 15% 67% 35%;
  gap: 1px 1px;
  grid-template-areas: "profile editbutton photodate" "photo photo photo" "phototext phototext phototext";
}

.profile {
  background-color: #1e1c2c;
  grid-area: profile;
  display: flex;
  border-radius: 25px;
}

.profile nav {
  background-color: #1e1c2c;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
}

.profile a {
  background-color: #1e1c2c;
  text-decoration: none;
  font-weight: bold;
}

.profile a:hover {
  color: #ffaa00;
  transition: 0.3s;
}

.profile p {
  background-color: #1e1c2c;
  color: gray;
}

.profile img {
  width: 50px;
  height: 50px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  margin: 1rem 1rem;
  justify-content: center;
}

.photo {
  grid-area: photo;
  justify-self: center;
  align-self: center;
}

.photo img {
  width: 600px;
  height: 400px;
  box-shadow: 8px 8px rgba(15, 14, 29, 0.5);
}

.phototext {
  grid-area: phototext;
  background-color: #1e1c2c;
  justify-self: start;
  align-self: start;
  padding: 0.5rem 1.5rem;
  display: flex;
  color: #ffaa00;
}

.phototext p {
  background-color: #1e1c2c;
  margin-right: 0.5rem;
  color: gray;
}

.photodate {
  grid-area: photodate;
  background-color: #1e1c2c;
  color: gray;
  align-self: center;
  justify-self: end;
  margin-right: 2rem;
}

.editbutton {
  grid-area: editbutton;
  align-self: start;
  justify-self: center;
}

.editbutton button {
  border: none;
  outline: none;
  cursor: pointer;
  margin-top: 0.5rem;
  justify-self: center;
  font-size: 20px;
  transition: 0.2s;
  opacity: 0.5;
}

.editbutton button:hover {
  opacity: 1;
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