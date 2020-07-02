<template>
  <div class="Profile view">
    <vue-headful title="Profile" description="Aqui puedes ver y editar tu perfil" />
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

    <div v-show="!loading" class="profilecontainer">
      <menucustom class="menucustom"></menucustom>

      <ProfileComponent
        class="profilecomponent"
        v-show="!loading"
        :profile="profile"
        :rates="rates"
        :followers="followers"
        :rate_media="rate_media"
      ></ProfileComponent>
      <section class="buttons">
        <button class="followbutton" v-show="!follow" @click="followUser()">Follow</button>
        <button class="unfollowbutton" v-show="follow" @click="unFollowUser()">Unfollow</button>
      </section>
      <section class="buttons">
        <button class="editbutton" v-show="showInfo" @click="openModal()">Editar perfil</button>
      </section>
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Editar Perfil</h2>
          <label class="profilenamelabel" for="profile_name">Nombre:</label>
          <input class="profilename" v-model="profile_name" placeholder />
          <br />
          <label class="biographylabel" for="biopgraphy">Biografia:</label>
          <input class="biography" v-model="biography" placeholder />
          <br />
          <label class="localitylabel" for="locality">Ubicación:</label>
          <input class="locality" v-model="locality" placeholder />
          <br />
          <label class="birthdaylabel" for="birthday">Fecha de nacimiento:</label>
          <input class="birthday" v-model="birthday" type="date" placeholder />
          <br />
          <label class="avatarlabel" for="avatar">Avatar:</label>
          <input class="avatar" type="file" id="file" ref="file" @change="handleFileUpload" />
          <br />
          <button class="buttonformadd" @click="editProfile(), closeModal()">Edit</button>
          <button class="buttonformclose" @click="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileComponent from "@/components/ProfileComponent.vue";
import menucustom from "@/components/MenuCustom.vue";
import axios from "axios";
import Swal from "sweetalert2";

import { getIsFollow } from "../api/utils";

export default {
  name: "Profile",
  components: {
    ProfileComponent,
    menucustom
  },
  data() {
    return {
      profile: {},
      rates: [],
      followers: [],
      profile_name: "",
      biography: "",
      locality: "",
      birthday: "",
      rate_media: "",
      isFollow: [],
      showInfo: false,
      userID: 0,
      file: null,
      loading: true,
      modal: false,
      correctData: false,
      required: false,
      follow: false
    };
  },
  methods: {
    checkInfo() {
      this.userID = localStorage.getItem("userID");
      if (this.$route.params.id != this.userID) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
    getProfile() {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.profile = response.data.data;
            self.profile_name = self.profile.profile_name;
            self.biography = self.profile.biography;
            self.locality = self.profile.locality;
            self.file = self.profile.avatar_img;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    getRating() {
      let self = this;
      axios
        .get("http://localhost:3001/rating/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          self.rates = response.data.data;
          self.rate_media = response.data.data[0].rate_media.substr(0, 3);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    getFollowers() {
      let self = this;
      axios
        .get("http://localhost:3001/followers/" + self.$route.params.id)
        .then(function(response) {
          self.followers = response.data.data;
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    async checkIsFollow() {
      let self = this;
      try {
        this.isFollow = await getIsFollow(self.$route.params.id);
        if (this.isFollow) {
          this.follow = true;
        } else {
          this.follow = false;
        }
        console.log(this.follow);
      } catch (error) {
        console.log(error);
      }
    },
    validatingData() {
      if (
        this.profile_name === "" ||
        this.biography === "" ||
        this.locality === ""
      ) {
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    editProfile() {
      let self = this;
      let photoFormData = new FormData();
      // dict of all elements
      photoFormData.append("profile_name", this.profile_name);
      photoFormData.append("biography", this.biography);
      photoFormData.append("locality", this.locality);
      photoFormData.append("birthday", this.birthday);
      if (this.file != null) {
        photoFormData.append("avatar", this.file);
      }
      axios
        .put(
          `http://localhost:3001/profile/${self.$route.params.id}`,
          photoFormData
        )
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
            /*   self.$router.push({ path: "/error" }); */
          }
        });

      /* this.validatingData(); // VALIDANDO DATOS DO FORM
      if (this.correctData === true) {
        let self = this;
        axios
          .put("http://localhost:3001/profile/" + self.$route.params.id, {
            profile_name: self.profile_name,
            biography: self.biography,
            locality: self.locality,
            birthday: self.birthday,
            avatar: self.file
          })
          .then(function(response) {
            //self.emptyFields()
            console.log(response);
            console.log(self.file);
          })
          .catch(function(error) {
            console.log(error);
          }); 
      } else {
        alert("No has rellenado todos los campos.");
      } */
    },
    followUser() {
      if (this.follow === false) {
        let self = this;
        axios
          .post("http://localhost:3001/follow/" + self.$route.params.id, {})
          .then(function(response) {
            //self.emptyFields();
            Swal.fire({
              icon: "success",
              title: "Has seguido a este usuario!",
              text: ""
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
          title: "Ya sigues a este usuario",
          text: ""
        });
      }
    },
    unFollowUser() {
      if (this.follow === true) {
        let self = this;
        axios
          .delete("http://localhost:3001/follow/" + self.$route.params.id, {})
          .then(function(response) {
            //self.emptyFields();
            Swal.fire({
              icon: "success",
              title: "Has dejado de seguir a este usuario!",
              text: ""
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
          title: "No sigues a este usuario",
          text: ""
        });
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    openModal(data) {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    }
  },
  created() {
    this.getProfile();
    this.getRating();
    this.getFollowers();
    this.checkInfo();
    this.checkIsFollow();
  }
};
</script>
<style scoped>
* {
  font-family: "Basier Square Regular";
}

.profilecontainer {
  background-color: #0f0e1d;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-template-rows: 90% 10%;
  grid-template-areas: "menucustom profilecomponent" "menucustom buttons";
  min-height: 100vh;
}

.menucustom {
  grid-area: menucustom;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
  min-height: 100%;
}

.profilecomponent {
  grid-area: profilecomponent;
  justify-self: center;
  margin-top: 5rem;
  border-radius: 25px;
}

.buttons {
  grid-area: buttons;
  background-color: #1e1c2c;
  align-self: center;
  justify-self: center;
}

.editbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
}

.followbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
}
.unfollowbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
}

.editbutton:hover {
  background: #c0440f;
}

.followbutton:hover {
  background: #c0440f;
}

.unfollowbutton:hover {
  background: #c0440f;
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
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 10% 10% 10% 10% 10% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "profilenamelabel profilename" "biographylabel biography" "localitylabel locality" "birthdaylabel birthday" "avatarlabel avatar" "buttonformclose buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
}

.profilename {
  grid-area: profilename;
}

.profilenamelabel {
  grid-area: profilenamelabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.biography {
  grid-area: biography;
}

.biographylabel {
  grid-area: biographylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
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

.birthday {
  grid-area: birthday;
}

.birthdaylabel {
  grid-area: birthdaylabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}

.avatar {
  grid-area: avatar;
}

.avatarlabel {
  grid-area: avatarlabel;
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
  outline: none;
}

.buttonformadd {
  grid-area: buttonformadd;
  width: 27rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  margin-left: -0.5rem;
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
  margin-right: 2rem;
  padding: 0.3rem;
  font-size: 20px;
  color: white;
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
