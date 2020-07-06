<template>
  <div>
    <div class="usertripsjoincontainer">
      <header class="header">
        <h6 class="headerjoin">Join</h6>
        <figure class="localityicon">
          <font-awesome-icon class="icon" icon="route" />
        </figure>
        <figure class="dateicon">
          <font-awesome-icon class="icon" icon="calendar-alt" />
        </figure>
      </header>

      <div class="jointrips" v-for="trip in trips" :key="trip.id">
        <p class="jointripslocality">
          <router-link :to=" {name:'TripView', params:{id:trip.id}} ">{{trip.locality}}</router-link>
        </p>
        <p class="jointripsdate">{{trip.date.substr(0,10)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMapMarkerAlt,
  faStarHalfAlt,
  faBirthdayCake,
  faRoute,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(faRoute, faCalendarAlt);

export default {
  name: "UserTripsJoinComponent",
  components: {},
  data() {
    return {};
  },
  props: {
    trips: Array
  },
  methods: {}
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

.usertripsjoincontainer {
  margin: 1rem;
}

.header {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-template-areas: "headerjoin headerjoin" "localityicon dateicon";
}

.headerjoin {
  grid-area: headerjoin;
  justify-self: center;
  align-self: center;
  padding: 0.25rem 0;
}

.localityicon {
  grid-area: localityicon;
  justify-self: center;
  align-self: center;
}

.dateicon {
  grid-area: dateicon;
  justify-self: center;
  align-self: center;
}

h6 {
  font-size: 20px;
  font-weight: bold;
  justify-self: center;
  align-self: center;
}

.jointrips {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;
  grid-template-areas: "jointripslocality jointripsdate";
  padding: 0.25rem 0;
  margin-top: 0.25rem;
}

.jointripslocality {
  grid-area: jointripslocality;
  justify-self: center;
  align-self: center;
  text-align: center;
}

.jointripslocality a {
  text-decoration: none;
  color: #ffaa00;
}

.jointripslocality a:hover {
  font-weight: bold;
}

.jointripsdate {
  grid-area: jointripsdate;
  justify-self: center;
  align-self: center;
  color: #ffaa00;
}

.icon {
  font-size: 20px;
}
</style>