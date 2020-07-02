<template>
  <div class="login">
    <vue-headful title="Login" description="Aquí puedes logearte" />
    <div class="loginformcontainer">
      <header class="header">
        <h2>Inicia sesión en Travel Together:</h2>
      </header>
      <form class="formcontainer">
        <label for="email" class="emaillabel">
          <font-awesome-icon icon="envelope-open-text" />
        </label>
        <input
          class="email"
          type="text"
          name="email"
          placeholder="Escribe tu email"
          v-model="email"
        />
        <label for="password" class="passwordlabel">
          <font-awesome-icon icon="lock" />
        </label>
        <input
          class="password"
          type="password"
          name="password"
          placeholder="Escribe tu contraseña"
          v-model="password"
        />
      </form>
      <div class="button">
        <button @click="login()">LOGIN</button>
      </div>
      <nav class="link">
        <a href="/#/register">Registrate en Travel Together</a>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import menucustom from "@/components/MenuCustom.vue";
import { loginUser } from "@/api/utils.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelopeOpenText, faLock } from "@fortawesome/free-solid-svg-icons";

library.add(faEnvelopeOpenText, faLock);

export default {
  name: "Login",
  components: {
    menucustom
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async login() {
      try {
        // INTENTO HACER LOGIN
        await loginUser(this.email, this.password);
        //localStorage.setItem("name", this.usuario);
        // SI HAY LOGIN, QUE ME LLEVE AL HOME
        this.$router.push("/");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
  color: white;
}

.loginformcontainer {
  align-items: center;
  margin-top: 13rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
}

.formcontainer {
  grid-column: 2;
  grid-row: 2;
  align-items: center;
  margin: 1rem;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-auto-rows: minmax(100px, 2);
}
.loginformcontainer input {
  border-radius: 25px;
  background-color: #21212f;
  border: none;
  margin: 1rem;
  font-size: 20px;
  padding: 0.5rem;
  color: white;
  outline: none;
}

.loginformcontainer button {
  width: 13rem;
  height: 2.5rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #ff6d00;
  border-radius: 25px;
  border: none;
  padding: 0.3rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
}

.loginformcontainer button:hover {
  background: #c0440f;
}

.header {
  text-align: center;
  grid-column: 2;
  grid-row: 1;
  font-size: 30px;
}
.email {
  max-width: 14rem;
  grid-column: 2;
  grid-row: 1;
  grid-area: 2rem;
}
.emaillabel {
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 1;
}
.password {
  max-width: 14rem;
  grid-column: 2;
  grid-row: 2;
}
.passwordlabel {
  margin-right: 0.25rem;
  text-align: right;
  grid-column: 1;
  grid-row: 2;
}

.button {
  grid-column: 2;
  grid-row: 3;
  margin: 0 auto;
}

.link {
  grid-column: 2;
  grid-row: 4;
  margin: 0 auto;
}
</style>