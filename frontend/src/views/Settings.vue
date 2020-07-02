<template>
  <div class="Account view">
    <vue-headful title="Settings" description="Aquí puedes modificar algunos valores de tu cuenta" />

    <div class="settingscontainer">
      <menucustom class="menucustom"></menucustom>
      <SettingsComponent class="settingscomponent" :account="account"></SettingsComponent>
      <button class="userbutton" @click="openModal()">Cambiar @Usuario</button>
      <button class="emailbutton" @click="openModalEmail()">Cambiar email</button>
      <button class="passwordbutton" @click="openModalPassword()">Cambiar contraseña</button>

      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2 class="headerform">Editar user_login</h2>
          <label class="uelabel" for="user_login">Name:</label>
          <input class="ue" v-model="user_login" :placeholder="actualUserLogin" />

          <button class="uebutton" @click="editUserLogin(), closeModal()">Edit</button>
          <button class="ueclosebutton" @click="closeModal()">Cerrar</button>
        </div>
      </div>
      <div class="modal" v-show="modalEmail2">
        <div class="modalBox">
          <h2 class="headerform">Editar email</h2>
          <label class="uelabel" for="email">Email:</label>
          <input class="ue" v-model="email" :placeholder="actualEmail" />

          <button class="uebutton" @click="editEmail(), closeModal2()">Edit</button>
          <button class="ueclosebutton" @click="closeModal2()">Cerrar</button>
        </div>
      </div>
      <div class="modal" v-show="modalPassword">
        <div class="modalBoxpass">
          <h2 class="headerpass">Editar password:</h2>
          <label class="oldpasslabel" for="oldPassword">Antigua contraseña:</label>
          <input class="oldpass" v-model="oldPassword" placeholder="oldpassword" />
          <br />
          <label class="newpasslabel" for="newPassword">Nueva contraseña:</label>
          <input class="newpass" v-model="newPassword" placeholder="newpassword" />
          <br />
          <br />
          <button class="passbutton" @click="editPassword(), closeModal3()">Edit</button>
          <button class="passclosebutton" @click="closeModal3()">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsComponent from "@/components/SettingsComponent.vue";
import axios from "axios";
import menucustom from "@/components/MenuCustom.vue";

export default {
  name: "Settings",
  components: {
    SettingsComponent,
    menucustom
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
      modal: false,
      modalEmail2: false,
      modalPassword: false,
      correctData: false,
      required: false
    };
  },
  methods: {
    getProfile() {
      let self = this;
      axios
        .get("http://localhost:3001/users/" + self.$route.params.id)
        .then(function(response) {
          //TIEMPO DE CARGA
          self.account = response.data.data;
          self.actualUserLogin = self.account.user_login;
          self.actualEmail = self.account.email;
        })
        .catch(function(error) {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
      console.log(self.account);
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
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
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
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
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
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
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
  }
};
</script>
<style scoped>
* {
  font-family: "Basier Square Regular";
}
/* Grid settings container */

.settingscontainer {
  background-color: #1e1c2c;
  display: grid;
  grid-template-columns: 10% 45% 30%;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "menucustom settingscomponent userbutton" "menucustom settingscomponent emailbutton" "menucustom settingscomponent passwordbutton";
}

.menucustom {
  grid-area: menucustom;
  align-self: start;
  background-color: #1e1c2c;
  position: fixed;
}

.settingscomponent {
  grid-area: settingscomponent;
  text-align: center;
}

.userbutton {
  grid-area: userbutton;
}

.emailbutton {
  grid-area: emailbutton;
}

.passwordbutton {
  grid-area: passwordbutton;
}

button {
  width: 15rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background-color: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.3rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
}
button:hover {
  background-color: #c0440f;
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
  padding: 50px;
  width: 40%;
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 50% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerform headerform" "uelabel ue" "ueclosebutton uebutton";
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
  grid-area: ueclosebutton;
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: black;
  background-color: white;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
}

.uebutton {
  grid-area: uebutton;
  width: 29rem;
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

/* Modal box grid password */

.modalBoxpass {
  background: #1e1c2c;
  margin: 10% auto;
  padding: 50px;
  width: 40%;
  height: 40%;
  color: white;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 20% 25% 25% 10%;
  gap: 10px 10px;
  grid-template-areas: "headerpass headerpass" "oldpasslabel oldpass" "newpasslabel newpass" "passclosebutton passbutton";
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
  grid-area: passclosebutton;
  width: 10rem;
  cursor: pointer;
  text-align: center;
  color: black;
  background: white;
  border-radius: 25px;
  border: none;
  padding: 0.4rem;
  margin: 1.5rem;
  margin-left: -1rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
}
.passbutton {
  grid-area: passbutton;
  width: 29rem;
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
</style>