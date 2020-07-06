<template>
  <div class="Account view">
    <vue-headful title="Settings" description="Aquí puedes modificar algunos valores de tu cuenta" />

    <roller class="roller" v-show="loading"></roller>

    <menucustom class="menucustom"></menucustom>
    <footercustom class="footercustom"></footercustom>

    <div class="settingscontainer" v-show="!loading">
      <SettingsComponent
        v-show="!loading"
        class="settingscomponent"
        :account="account"
        :showAdmin="showAdmin"
      ></SettingsComponent>

      <button class="userbutton" @click="openModal()">Cambiar @Usuario</button>
      <button class="emailbutton" @click="openModalEmail()">Cambiar email</button>
      <button class="passwordbutton" @click="openModalPassword()">Cambiar contraseña</button>

      <router-link class="adminbutton" id="link" :to="{ name: 'Admin'}">
        <button v-show="showAdmin">Administrar</button>
      </router-link>

      <transition name="fade">
        <div class="modal" v-show="modal">
          <div class="modalBox">
            <h2 class="headerform">Editar user_login</h2>
            <label class="uelabel" for="user_login">Name:</label>
            <input class="ue" v-model="user_login" :placeholder="actualUserLogin" />

            <button class="uebutton" @click="editUserLogin(), closeModal()">Edit</button>
            <button class="ueclosebutton" @click="closeModal()">
              <font-awesome-icon class="icon" icon="times" />
            </button>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div class="modal" v-show="modalEmail2">
          <div class="modalBox">
            <h2 class="headerform">Editar email</h2>
            <label class="uelabel" for="email">Email:</label>
            <input class="ue" v-model="email" :placeholder="actualEmail" />

            <button class="uebutton" @click="editEmail(), closeModal2()">Edit</button>
            <button class="ueclosebutton" @click="closeModal2()">
              <font-awesome-icon class="icon" icon="times" />
            </button>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div class="modal" v-show="modalPassword">
          <div class="modalBoxpass">
            <h2 class="headerpass">Editar password:</h2>
            <label class="oldpasslabel" for="oldPassword">Antigua contraseña:</label>
            <input
              type="password"
              class="oldpass"
              v-model="oldPassword"
              placeholder="Contraseña actual"
            />
            <br />
            <label class="newpasslabel" for="newPassword">Nueva contraseña:</label>
            <input
              type="password"
              class="newpass"
              v-model="newPassword"
              placeholder="Contraseña nueva"
            />
            <br />
            <br />
            <button class="passbutton" @click="editPassword(), closeModal3()">Edit</button>
            <button class="passclosebutton" @click="closeModal3()">
              <font-awesome-icon class="icon" icon="times" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import SettingsComponent from "@/components/SettingsComponent.vue";
import axios from "axios";
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
import roller from "@/components/RollerComponent.vue";

import Swal from "sweetalert2";
import { checkAdmin } from "../../api/utils.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faTimes);

export default {
  name: "Settings",
  components: {
    SettingsComponent,
    menucustom,
    roller,
    footercustom
  },
  data() {
    return {
      account: {},
      user_login: "",
      email: "",
      actualUserLogin: "",
      actualEmail: "",
      oldPassword: "",
      newPassword: "",
      loading: true,
      modal: false,
      modalEmail2: false,
      modalPassword: false,
      correctData: false,
      required: false,
      showAdmin: false
    };
  },
  methods: {
    getProfile() {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + self.$route.params.id)
        .then(function(response) {
          setTimeout(function() {
            self.loading = false;
            self.account = response.data.data;
            self.actualUserLogin = self.account.user_login;
            self.actualEmail = self.account.email;
          }, 1000);
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
      console.log(self.account);
    },
    showAdminInfo() {
      if (checkAdmin() === true) {
        this.showAdmin = true;
      } else {
        this.showAdmin = false;
      }
      console.log(this.showAdmin);
    },
    validatingDataUserLogin() {
      if (this.user_login === "") {
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    validatingDataEmail() {
      if (this.email === "") {
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    validatingDataPassword() {
      if (this.oldPassword === "" || this.newPassword === "") {
        this.correctData = false; // NON ENVIAR
        this.required = true; // MOSTRA O MENSAXE
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    editUserLogin() {
      this.validatingDataUserLogin(); // VALIDANDO DATOS DO FORM
      if (this.correctData === true) {
        let self = this;
        axios
          .put("http://localhost:3001/users/" + self.$route.params.id, {
            user_login: self.user_login,
            email: self.actualEmail
          })
          .then(function(response) {
            //self.emptyFields()
            Swal.fire({
              icon: "success",
              title: "Login cambiado correctamente",
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
            Swal.fire({
              icon: "error",
              title: `${self.user_login} no está disponible`,
              text: "Escoje otro login",
              background: "#1e1c2c",
              confirmButtonColor: "#ff6d00"
            });
          });
      } else {
        alert("No has rellenado todos los campos.");
      }
    },
    editEmail() {
      this.validatingDataEmail(); // VALIDANDO DATOS DO FORM
      if (this.correctData === true) {
        let self = this;
        axios
          .put("http://localhost:3001/users/" + self.$route.params.id, {
            user_login: self.actualUserLogin,
            email: self.email
          })
          .then(function(response) {
            //self.emptyFields()
            Swal.fire({
              icon: "success",
              title: "Email cambiado correctamente",
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
            Swal.fire({
              icon: "error",
              title: "Has escrito mal el email",
              text: "Intentalo de nuevo!",
              background: "#1e1c2c",
              confirmButtonColor: "#ff6d00"
            });
          });
      } else {
        alert("No has rellenado todos los campos.");
      }
    },
    editPassword() {
      this.validatingDataPassword(); // VALIDANDO DATOS DO FORM
      if (this.correctData === true) {
        let self = this;
        axios
          .post(
            "http://localhost:3001/users/" +
              self.$route.params.id +
              "/password",
            {
              oldPassword: self.oldPassword,
              newPassword: self.newPassword
            }
          )
          .then(function(response) {
            //self.emptyFields()
            Swal.fire({
              icon: "success",
              title: "Contraseña cambiada correctamente!",
              text: "No te olvides de tu contraseña",
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
            Swal.fire({
              icon: "error",
              title: "Has escrito mal tu contraseña actual",
              text: "Intentalo de nuevo!",
              background: "#1e1c2c",
              confirmButtonColor: "#ff6d00"
            });
          });
      } else {
        alert("No has rellenado todos los campos.");
      }
    },

    openModal(data) {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    openModalEmail(data) {
      this.modalEmail2 = true;
    },
    closeModal2() {
      this.modalEmail2 = false;
    },
    openModalPassword(data) {
      this.modalPassword = true;
    },
    closeModal3() {
      this.modalPassword = false;
    }
  },
  created() {
    this.getProfile();
    this.showAdminInfo();
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

/* Grid settings container */

.settingscontainer {
  background-color: #1e1c2c;
  display: grid;
  grid-template-columns: 10% 45% 30%;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-areas: "menucustom settingscomponent userbutton" "menucustom settingscomponent emailbutton" "menucustom settingscomponent passwordbutton" "menucustom settingscomponent adminbutton";
}

.menucustom {
  grid-area: menucustom;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.settingscomponent {
  grid-area: settingscomponent;
  align-self: end;
  justify-self: center;
  text-align: center;
}

.userbutton {
  grid-area: userbutton;
  align-self: center;
  width: 15rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 0.5rem;
  font-weight: bold;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

.userbutton:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.emailbutton {
  grid-area: emailbutton;
  align-self: center;
  width: 15rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 0.5rem;
  font-weight: bold;

  justify-self: center;
  outline: none;
  transition: 0.3s;
}

.emailbutton:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.passwordbutton {
  grid-area: passwordbutton;
  align-self: center;
  width: 15rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 0.5rem;
  font-weight: bold;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

.passwordbutton:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.adminbutton {
  grid-area: adminbutton;
  align-self: center;
  justify-self: center;
}

.adminbutton button {
  width: 15rem;
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

.adminbutton button:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

/* Modal box grid userlogin and mail */

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
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 50% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "uelabel ue" "uebutton uebutton";
}

.modalBox input {
  padding: 0.5rem;
  height: 2rem;
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  font-size: 20px;
  color: white;
}

.headerform {
  grid-area: headerform;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.ue {
  grid-area: ue;
  align-self: center;
  text-align: left;
}

.uelabel {
  grid-area: uelabel;
  align-self: center;
  text-align: left;
  margin-left: 5rem;
}
.ueclosebutton {
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

.ueclosebutton:hover {
  opacity: 1;
}

.uebutton {
  grid-area: uebutton;
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

.uebutton:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

/* Modal box grid password */

.modalBoxpass {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 30px 40px;
  width: 40%;
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 25% 25% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerpass headerpass" "oldpasslabel oldpass" "newpasslabel newpass" "passbutton passbutton";
}

.modalBoxpass input {
  padding: 0.5rem;
  height: 2rem;
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  font-size: 20px;
  color: white;
}

.headerpass {
  grid-area: headerpass;
  text-align: center;
  font-size: 26px;
  align-self: center;
}

.oldpass {
  grid-area: oldpass;
  align-self: center;
  text-align: left;
}

.oldpasslabel {
  grid-area: oldpasslabel;
  align-self: center;
  text-align: left;
}

.newpass {
  grid-area: newpass;
  align-self: center;
  text-align: left;
}

.newpasslabel {
  grid-area: newpasslabel;
  align-self: center;
  text-align: left;
}

.passclosebutton {
  grid-area: headerpass;
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

.passclosebutton:hover {
  opacity: 1;
}

.passbutton {
  grid-area: passbutton;
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

.passbutton:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
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