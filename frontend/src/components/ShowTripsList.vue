<template>
  <div class="trips">
    <div class="showtripslist" v-for="trip in trips" :key="trip.id">
      <figure class="profile">
        <img
          class="profileavatar"
          :src="trip.avatar_img ? path + trip.avatar_img : defaultAvatar"
          alt
        />
        <nav class="profile_name">
          <router-link
            id="link"
            :to="{ name: 'Profile', params:{ id: trip.id_user }}"
          >{{ trip.profile_name }}</router-link>
        </nav>
      </figure>
      <div class="locality">
        <router-link id="link" :to="{ name: 'TripView', params:{ id: trip.id }}">
          <font-awesome-icon class="icon" icon="route" />
          {{trip.locality}}
        </router-link>
      </div>
      <div class="date">
        <font-awesome-icon class="icon" icon="calendar-alt" />
        {{trip.date.substr(0,10)}}
      </div>
      <div class="category">
        <font-awesome-icon class="icon" icon="star" />
        {{trip.category}}
      </div>
      <div class="description">
        <font-awesome-icon icon="file" />
        {{trip.description.substr(0,40) + '...'}}
      </div>
      <div class="budget">
        <font-awesome-icon class="icon" icon="money-bill-alt" />
        {{trip.budget}}
      </div>
      <div class="users">
        <font-awesome-icon class="icon" icon="user" />users
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faRoute,
  faCalendarAlt,
  faMoneyBillAlt,
  faUser,
  faStar
} from "@fortawesome/free-solid-svg-icons";

library.add(faFile, faRoute, faCalendarAlt, faMoneyBillAlt, faUser, faStar);

export default {
  name: "ShowTripsdivst",
  data() {
    return {
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      showInfo: true,
      userID: 0
    };
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
  background-color: #0f0e1d;
}

.showtripslist {
  margin: 2rem;
  background-color: #1e1c2c;
  color: white;
  display: grid;
  grid-template-columns: 10% 30% 30% 30%;
  grid-template-rows: 20% 20% 20%;
  gap: 1px 1px;
  grid-template-areas: "profile locality category date" "profile description description description" "profile budget . users";
  height: 12rem;
  border-radius: 25px;
}

.showtripslist > div {
  text-align: center;
  align-self: center;
  justify-self: center;
  font-size: 20px;
}

.showtripslist > div,
figure {
  background-color: #1e1c2c;
}

.showtripslist figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.locality {
  grid-area: locality;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.date {
  grid-area: date;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.category {
  grid-area: category;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.description {
  grid-area: description;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
}

.budget {
  grid-area: budget;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7rem;
}

.users {
  grid-area: users;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7rem;
}

.profile img {
  width: 100px;
  height: 100px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  justify-content: center;
}

.profile_ {
  grid-area: profile;
  background-color: #1e1c2c;
}
#link {
  background-color: #1e1c2c;
  text-decoration: none;
}

.icon {
  background-color: #1e1c2c;
}
</style>

