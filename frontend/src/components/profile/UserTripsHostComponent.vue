<template>
  <div>
    <div class="usertripshostcontainer">
      <header class="header">
        <h6 class="headerhost">Host</h6>
        <figure class="localityicon">
          <font-awesome-icon class="icon" icon="route" />
        </figure>
        <figure class="dateicon">
          <font-awesome-icon class="icon" icon="calendar-alt" />
        </figure>
      </header>

      <div class="hosttrips" v-for="trip in tripsHosted" :key="trip.id">
        <p class="hosttripslocality">
          <router-link :to=" {name:'TripView', params:{id:trip.id}} ">{{trip.locality}}</router-link>
        </p>
        <p class="hosttripsdate">{{trip.date.substr(0,10)}}</p>
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
  faBirthdayCake
} from "@fortawesome/free-solid-svg-icons";

library.add(faMapMarkerAlt, faStarHalfAlt, faBirthdayCake);

export default {
  name: "UserTripsHostComponent",
  components: {},
  data() {
    return {};
  },
  props: {
    tripsHosted: Array
  },
  methods: {}
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

.usertripshostcontainer {
  margin: 1rem;
}

.header {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-template-areas: "headerhost headerhost" "localityicon dateicon";
}

.headerhost {
  grid-area: headerhost;
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

.hosttrips {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;
  grid-template-areas: "hosttripslocality hosttripsdate";
  padding: 0.25rem 0;
  margin-top: 0.25rem;
}

.hosttripslocality {
  grid-area: hosttripslocality;
  justify-self: center;
  align-self: center;
  text-align: center;
}

.hosttripslocality a {
  text-decoration: none;
  color: #ffaa00;
}

.hosttripslocality a:hover {
  font-weight: bold;
}

.hosttripsdate {
  grid-area: hosttripsdate;
  justify-self: center;
  align-self: center;
  color: #ffaa00;
}

.icon {
  font-size: 20px;
}
</style>