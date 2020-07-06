<template>
  <div>
    <div class="account">
      <div class="userlogin">
        <p>User Login:</p>
        {{ '@'+account.user_login }}
      </div>
      <div class="email">
        <p>Email:</p>
        {{ account.email }}
      </div>
      <div class="password">Password</div>
      <div v-show="showAdmin" class="admin">Administrar Travel Together</div>
    </div>
  </div>
</template>

<script>
import { checkAdmin } from "../api/utils.js";

export default {
  name: "SettingsComponent",
  data() {
    return {
      showInfo: true,
      userID: 0
    };
  },
  props: {
    account: Object,
    showAdmin: Boolean
  },
  methods: {
    checkInfo() {
      this.userID = localStorage.getItem("userID");
      if (this.$route.params.id != this.userID) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    }
  },
  created() {
    this.checkInfo();
  }
};
</script>

<style scoped>
.account {
  background-color: #1e1c2c;
  color: white;
  height: 20rem;
  width: 50rem;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-areas: "userlogin" "email" "password" "admin";
}
.userlogin {
  grid-area: userlogin;
  align-self: center;
  justify-self: center;
  display: flex;
  color: #ff6d00;
}

.userlogin p {
  margin-right: 0.5rem;
  font-weight: bold;
}

.email {
  grid-area: email;
  align-self: center;
  justify-self: center;
  display: flex;
  color: #ff6d00;
}

.email p {
  margin-right: 0.5rem;
  font-weight: bold;
}

.password {
  grid-area: password;
  align-self: center;
  justify-self: center;
  font-weight: bold;
}

.admin {
  grid-area: admin;
  align-self: center;
  justify-self: center;
  font-weight: bold;
}
</style>