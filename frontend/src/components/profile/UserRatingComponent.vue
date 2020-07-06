<template>
  <div>
    <div class="container">
      <div class="rates" v-for="(rate, index) in lastRates" :key="rate.id">
        <p class="user_login">
          <font-awesome-icon class="icon" icon="user-alt" />
          {{'@'+lastRates[index].user_login}}
        </p>
        <div class="points">
          <star-rating
            :rating="lastRates[index].points"
            :read-only="true"
            :increment="0.01"
            :star-size="15"
            inactive-color="#423f57"
            active-color="#ffaa00"
            :border-width="3"
          ></star-rating>
        </div>
        <p class="message">{{lastRates[index].rate_text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faUserAlt);

export default {
  name: "ProfileComponent",
  components: { StarRating },
  data() {
    return {};
  },
  props: {
    lastRates: Array
  },
  methods: {}
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

.rates {
  border-radius: 25px;
  display: grid;
  margin: 1rem;
  padding: 1rem;
  grid-template-columns: 50% 50%;
  grid-template-rows: 40% 90%;
  grid-template-areas: "user_login points" "message message";
}

.user_login {
  grid-area: user_login;
  color: gray;
  font-style: italic;
  align-self: center;
  justify-self: start;
}

.points {
  grid-area: points;
  align-self: center;
  justify-self: end;
}

.message {
  grid-area: message;
  align-self: center;
  justify-self: center;
  text-align: center;
  color: #ffaa00;
}
</style>