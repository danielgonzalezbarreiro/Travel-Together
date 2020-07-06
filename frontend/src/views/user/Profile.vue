<template>
  <div class="Profile view">
    <vue-headful title="Profile" description="Aqui puedes ver y editar tu perfil" />
    <!--  SIMBOLO DE CARGA  -->
    <roller class="roller" v-show="loading"></roller>

    <menucustom class="menucustom"></menucustom>
    <footercustom class="footercustom"></footercustom>

    <div v-show="!loading" class="profilecontainer">
      <ProfileComponent
        class="profilecomponent"
        v-show="!loading"
        :profile="profile"
        :rates="rates"
        :followers="followers"
        :following="following"
        :rate_media="rate_media"
      ></ProfileComponent>
      <section class="buttons">
        <button class="followbutton" v-show="!follow" @click="followUser()">Follow</button>
        <button class="unfollowbutton" v-show="follow" @click="unFollowUser()">Unfollow</button>
      </section>
      <section class="buttons">
        <button class="editbutton" v-show="showInfo" @click="openModal()">
          <font-awesome-icon class="icon" icon="edit" />
        </button>
        <button class="avatarbutton" v-show="showInfo" @click="openModalAvatar()">
          <font-awesome-icon class="icon" icon="user-circle" />
        </button>
      </section>

      <usertripshostcomponent class="usertripshost" :tripsHosted="tripsHosted"></usertripshostcomponent>

      <usertripsjoincomponent class="usertripsjoin" :trips="trips"></usertripsjoincomponent>

      <userratingcomponent class="userrates" :lastRates="lastRates"></userratingcomponent>

      <!-- CAMBIAR AVATAR MODAL  -->
      <transition name="fade">
        <div class="modal" v-show="modalavatar">
          <div class="modalBoxAvatar">
            <h2 class="headerformavatar">Cambiar Avatar</h2>
            <label class="avatarlabel" for="avatar">Avatar:</label>
            <input class="avatar" type="file" id="file" ref="file" @change="handleFileUpload" />

            <button class="buttonformavatar" @click="editAvatar(), closeModalAvatar()">Edit</button>
            <button class="buttonformcloseavatar" @click="closeModalAvatar()">
              <font-awesome-icon class="icon" icon="times" />
            </button>
          </div>
        </div>
      </transition>

      <!-- EDITAR PERFIL MODAL -->
      <transition name="fade">
        <div class="modal" v-show="modal">
          <div class="modalBox">
            <h2 class="headerform">Editar Perfil</h2>
            <label class="profilenamelabel" for="profile_name">Nombre:</label>
            <input class="profilename" v-model="profile_name" placeholder />

            <label class="biographylabel" for="biopgraphy">Biografia:</label>
            <input class="biography" v-model="biography" placeholder />

            <label class="localitylabel" for="locality">Ubicación:</label>
            <input class="locality" v-model="locality" placeholder />

            <label class="birthdaylabel" for="birthday">Fecha de nacimiento:</label>
            <input class="birthday" v-model="birthday" type="date" placeholder />

            <button class="buttonformadd" @click="editProfile(), closeModal()">Edit</button>
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
import ProfileComponent from "@/components/profile/ProfileComponent.vue";
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
import roller from "@/components/RollerComponent.vue";
import usertripshostcomponent from "@/components/profile/UserTripsHostComponent.vue";
import usertripsjoincomponent from "@/components/profile/UserTripsJoinComponent.vue";
import userratingcomponent from "@/components/profile/UserRatingComponent.vue";

import axios from "axios";
import Swal from "sweetalert2";

import { getIsFollow } from "../../api/utils";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faUserCircle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

library.add(faEdit, faUserCircle, faTimes);

export default {
  name: "Profile",
  components: {
    ProfileComponent,
    menucustom,
    usertripshostcomponent,
    userratingcomponent,
    usertripsjoincomponent,
    roller,
    footercustom
  },
  data() {
    return {
      profile: {},
      rates: [],
      lastRates: [],
      followers: [],
      following: [],
      isFollow: [],
      trips: [],
      tripsHosted: [],
      profile_name: "",
      biography: "",
      locality: "",
      birthday: "",
      rate_media: "",
      showInfo: false,
      userID: 0,
      file: null,
      loading: true,
      modal: false,
      modalavatar: false,
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
    getRatingAvg() {
      let self = this;
      axios
        .get("http://localhost:3001/rating/avg/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          self.rate_media = response.data.data[0].rate_media.substr(0, 3);
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
          self.lastRates = self.rates.slice(self.rates.length - 3);
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
    getFollowing() {
      let self = this;
      axios
        .get("http://localhost:3001/following/" + self.$route.params.id)
        .then(function(response) {
          self.following = response.data.data;
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
    editAvatar() {
      let self = this;
      let photoFormData = new FormData();
      if (this.file != null) {
        photoFormData.append("avatar", this.file);
      }
      axios
        .put(
          `http://localhost:3001/profile/avatar/${self.$route.params.id}`,
          photoFormData
        )
        .then(function(response) {
          self.closeModal();
          Swal.fire({
            icon: "success",
            title: "Avatar modificado",
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
          title: "Ya sigues a este usuario",
          text: "",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
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
          title: "No sigues a este usuario",
          text: "",
          background: "#1e1c2c",
          confirmButtonColor: "#ff6d00"
        });
      }
    },
    getUserTrips() {
      let self = this;
      self.id = localStorage.getItem("userID");
      axios
        .get("http://localhost:3001/trips/usertrips/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.trips = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    getUserTripsHosted() {
      let self = this;
      self.id = localStorage.getItem("userID");
      axios
        .get(
          "http://localhost:3001/trips/usertripshosted/" + self.$route.params.id
        )
        .then(function(response) {
          //TIEMPO DE CARGA
          setTimeout(function() {
            self.loading = false;
            self.tripsHosted = response.data.data;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    openModal(data) {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    openModalAvatar() {
      this.modalavatar = true;
    },
    closeModalAvatar() {
      this.modalavatar = false;
    }
  },
  created() {
    this.getProfile();
    this.getRating();
    this.getRatingAvg();
    this.getFollowers();
    this.getFollowing();
    this.checkInfo();
    this.checkIsFollow();
    this.getUserTrips();
    this.getUserTripsHosted();
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

.profilecontainer {
  background-color: #0f0e1d;
  display: grid;
  grid-template-columns: 10% 45% 18% 22.5%;
  grid-template-rows: 1% 45% 45%;
  grid-template-areas: "menucustom buttons . ." "menucustom profilecomponent usertripsjoin usertripshost" "menucustom profilecomponent userrates userrates";
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
  margin-top: 3rem;
  border-radius: 25px;
}

.usertripsjoin {
  grid-area: usertripsjoin;
  justify-self: end;
  margin-right: 1rem;
  margin-top: 6rem;
  border-radius: 25px;
  width: 18rem;
  height: 75%;
}

.usertripshost {
  grid-area: usertripshost;
  justify-self: start;
  margin-left: 1rem;
  margin-top: 6rem;
  border-radius: 25px;
  width: 18rem;
  height: 75%;
}

.userrates {
  grid-area: userrates;
  justify-self: center;
  margin-top: 3rem;
  margin-right: 5rem;
  border-radius: 25px;
  width: 38rem;
  height: 75%;
}

.buttons {
  grid-area: buttons;
  background-color: #1e1c2c;
  align-self: start;
  justify-self: center;
  margin-top: 4.5rem;
}

.editbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
  margin-right: 1rem;
  transition: 0.2s;
  opacity: 0.5;
  font-size: 25px;
}

.avatarbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: #1e1c2c;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  outline: none;
  transition: 0.2s;
  opacity: 0.5;
  font-size: 26px;
  margin-left: 18rem;
}

.followbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: #ff6d00;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}
.unfollowbutton {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

.editbutton:hover {
  opacity: 1;
}

.avatarbutton:hover {
  opacity: 1;
}

.followbutton:hover {
  background: #1e1c2c;
}

.unfollowbutton:hover {
  background: #ff6d00;
}

/* MODAL BOX EDITAR PERFIL */
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
  grid-template-rows: 20% 10% 10% 10% 10% 10% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "profilenamelabel profilename" "biographylabel biography" "localitylabel locality" "birthdaylabel birthday" "buttonformadd buttonformadd";
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
  align-self: center;
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
  margin-top: 60px;
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

/* MODAL BOX EDIT AVATAR */
.modalBoxAvatar {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 30px 40px;
  width: 40%;
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 55% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerformavatar headerformavatar" "avatarlabel avatar" "buttonformavatar buttonformavatar";
}

.headerformavatar {
  grid-area: headerformavatar;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.avatar {
  grid-area: avatar;
}

.avatarlabel {
  grid-area: avatarlabel;
  align-self: center;
  text-align: center;
  margin-left: 5rem;
  font-weight: bold;
}

.buttonformcloseavatar {
  grid-area: headerformavatar;
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

.buttonformcloseavatar:hover {
  opacity: 1;
}

.buttonformavatar {
  grid-area: buttonformavatar;
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

.buttonformavatar:hover {
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

/* ROLLER */
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

