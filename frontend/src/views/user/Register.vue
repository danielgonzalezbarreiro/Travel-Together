<template>
  <div class="register">
    <vue-headful title="Register" description="Aquí puedes registrarte" />
    <!-- FORMULARIO -->
    <h1>Registrate en Travel Together</h1>
    <div class="registerformcontainer">
      <label class="emaillabel" for="email">
        <font-awesome-icon icon="envelope-open-text" />
      </label>
      <input class="email" type="email" name="email" placeholder="Escribe tu email" v-model="email" />
      <input
        class="oldpassword"
        type="password"
        name="password"
        placeholder="Escribe tu contraseña"
        v-model="password"
      />
      <label class="passwordlabel" for="password">
        <font-awesome-icon icon="lock" />
      </label>
      <input
        class="newpassword"
        type="password"
        name="password2"
        placeholder="Vuelve a escribir tu contraseña"
        v-model="password2"
      />

      <label class="user_loginlabel" for="user_login">
        <font-awesome-icon icon="at" />
      </label>
      <input
        class="user_login"
        type="text"
        name="user_login"
        placeholder="Escribe tu nombre de usuario"
        v-model="user_login"
      />

      <label class="profile_namelabel" for="profile_name">
        <font-awesome-icon icon="user" />
      </label>
      <input
        class="profile_name"
        type="text"
        name="profile_name"
        placeholder="Escribe tu nombre de perfil"
        v-model="profile_name"
      />

      <label class="birthdaylabel" for="birthday">
        <font-awesome-icon icon="birthday-cake" />
      </label>
      <input class="birthday" type="date" name="birthday" placeholder="birthday" v-model="birthday" />

      <button @click="addUser()">Registrar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import menucustom from "@/components/MenuCustom.vue";
import { registerUser } from "../../api/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelopeOpenText,
  faLock,
  faAt,
  faUser,
  faBirthdayCake
} from "@fortawesome/free-solid-svg-icons";

library.add(faEnvelopeOpenText, faLock, faAt, faUser, faBirthdayCake);

export default {
  name: "Register",
  components: {
    menucustom
  },
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      user_login: "",
      profile_name: "",
      birthday: "",
      errorMsg: "Error",
      correctData: false,
      required: false
    };
  },
  methods: {
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
      if (
        this.email === "" ||
        this.password === "" ||
        this.user_login === "" ||
        this.profile_name === "" ||
        this.birthday === "" ||
        this.locality == ""
      ) {
        this.errorNotification("Por favor cubre todos los campos");
        return;
      } else if (this.password !== this.password2) {
        this.errorNotification("Las contraseñas no coinciden");
        return;
      } else if (!this.validateEmail(this.email)) {
        this.errorNotification("El email no es valido");
        return;
      } else {
        this.correctData = true; // ENVIAR
        this.required = false; // NON MOSTRA O MENSAXE
      }
    },
    async addUser() {
      this.validatingData();
      if (this.correctData) {
        try {
          await registerUser(
            this.email,
            this.password,
            this.user_login,
            this.profile_name,
            this.birthday
          );
          // SI HAY LOGIN, QUE ME LLEVE AL HOME
          Swal.fire({
            icon: "success",
            title: "Registrado!",
            text: "No olvides checkear tu inbox y spam antes de loguearte",
            background: "#1e1c2c",
            confirmButtonColor: "#ff6d00"
          });
          this.$router.push("login");
        } catch (error) {
          console.log(error);
        }
      }
      return;
    },
    emptyFields() {
      this.email = "";
      this.password = "";
      this.user_login === "";
      this.name === "";
      this.nif === "";
      this.birthday === "";
    },
    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
  color: white;
}

h1 {
  text-align: center;
  font-size: 30px;
  margin: 3rem;
}

.registerformcontainer input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  margin: 1rem;
  padding: 0.3rem;
  font-size: 20px;
  color: white;
}

.registerformcontainer button {
  width: 20rem;
  height: 2.5rem;
  cursor: pointer;
  text-align: center;
  color: white;
  border: 2px solid rgba(255, 109, 0, 0.6);
  background: #1e1c2c;
  border-radius: 25px;
  padding: 0.3rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}
.registerformcontainer button:hover {
  background: #ff6d00;
}
.registerformcontainer {
  align-items: center;
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
}
/* Grid containerformelements */
.email {
  grid-column: 2;
  grid-row: 1;
}
.emaillabel {
  font-size: 20px;
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 1;
}
.oldpassword {
  grid-column: 2;
  grid-row: 2;
}
.newpassword {
  grid-column: 2;
  grid-row: 3;
  align-self: start;
}
.passwordlabel {
  font-size: 20px;
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 2;
}
.user_login {
  grid-column: 2;
  grid-row: 4;
}
.user_loginlabel {
  font-size: 20px;
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 4;
}
.profile_name {
  grid-column: 2;
  grid-row: 5;
}
.profile_namelabel {
  font-size: 20px;
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 5;
}
.birthday {
  grid-column: 2;
  grid-row: 6;
}
.birthdaylabel {
  font-size: 20px;
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 6;
}

button {
  grid-column: 2;
  grid-row: 7;
}
</style>

