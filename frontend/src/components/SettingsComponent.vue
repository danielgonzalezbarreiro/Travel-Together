<template>
  <div>
    <div class="account">
      <div class="user_login">
        <p>{{ account.user_login }}</p>
      </div>
      <div class="email">{{ account.email }}</div>
      <div class="password">Password</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsComponent",
  data() {
    return {
      showInfo: true,
      userID: 0
    };
  },
  props: {
    account: Object
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
  height: 15rem;
  width: 50rem;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "userlogin" "email" "password";
}
.userlogin {
  grid-area: userlogin;
  align-self: center;
  justify-self: center;
}

.email {
  grid-area: email;
}

.password {
  grid-area: password;
}
</style>