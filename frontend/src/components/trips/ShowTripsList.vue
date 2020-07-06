<template>
  <div class="trips">
    <div class="showtripslist" v-for="trip in trips" :key="trip.id">
      <nav class="profile">
        <router-link id="link" :to="{ name: 'Profile', params:{ id: trip.id_user }}">
          <img :src="trip.avatar_img ? path + trip.avatar_img : defaultAvatar" alt />
          <h4>{{ trip.profile_name }}</h4>
          <p>{{'@' + trip.user_login}}</p>
        </router-link>
      </nav>

      <figure class="localitylabel">
        <font-awesome-icon class="icon" icon="route" />
        <p>Destino</p>
      </figure>
      <div class="locality">{{trip.locality}}</div>

      <figure class="datelabel">
        <font-awesome-icon class="icon" icon="calendar-alt" />
        <p>Fecha</p>
      </figure>
      <div class="date">{{trip.date.substr(0,10)}}</div>

      <figure class="categorylabel">
        <font-awesome-icon class="icon" icon="star" />
        <p>Categoria</p>
      </figure>
      <div class="category">
        <p>{{trip.category}}</p>
      </div>

      <figure class="descriptionlabel">
        <font-awesome-icon icon="file" />
        <p>Descripción</p>
      </figure>
      <div class="description">{{trip.description.substr(0,70) + '...'}}</div>

      <figure class="budgetlabel">
        <font-awesome-icon class="icon" icon="money-bill-alt" />
      </figure>
      <div class="budget">{{trip.budget + '€'}}</div>

      <figure class="userslabel">
        <font-awesome-icon class="icon" icon="user" />
      </figure>
      <div class="users">
        <p>?</p>
      </div>

      <section class="buttonshow">
        <router-link id="link" :to="{ name: 'TripView', params:{ id: trip.id }}">
          <button>Ver</button>
        </router-link>
      </section>
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
  name: "ShowTripsList",
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
  padding: 0.25rem;
  background-color: #1e1c2c;
  color: white;
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 10%;
  grid-template-rows: 16% 16% 16% 16% 16% 16%;
  gap: 1px 1px;
  grid-template-areas: "profile datelabel descriptionlabel descriptionlabel buttonshow" "profile date descriptionlabel descriptionlabel buttonshow" "profile localitylabel description description buttonshow" "profile locality description description buttonshow" "profile categorylabel budgetlabel userslabel buttonshow" "profile category budget users buttonshow";
  height: 13rem;
  border-radius: 25px;
}

.profile {
  grid-area: profile;
  justify-self: center;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  align-self: center;
  text-align: center;
  transition: 0.3s;
}

.profile:hover {
  opacity: 0.7;
}

h4 {
  font-size: 19px;
  background-color: #1e1c2c;
}

p {
  background-color: #1e1c2c;
  margin-left: 0.5rem;
}

.profile p {
  background-color: #1e1c2c;
  font-style: italic;
  margin: 0;
  text-align: center;
  align-self: center;
  color: gray;
  font-size: 16px;
}

.profile img {
  width: 100px;
  height: 100px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  margin: 1rem 1rem;
  justify-content: center;
  transition: 0.3s;
}

.datelabel {
  grid-area: datelabel;
  justify-self: start;
  display: flex;
  align-self: end;
  font-weight: bold;
}

.date {
  grid-area: date;
  text-align: left;
  align-self: center;
  justify-self: start;
  color: #ffaa00;
}

.localitylabel {
  grid-area: localitylabel;
  justify-self: start;
  display: flex;
  align-self: end;
  font-weight: bold;
}

.locality {
  grid-area: locality;
  text-align: left;
  align-self: center;
  justify-self: start;
  color: #ffaa00;
}

.categorylabel {
  grid-area: categorylabel;
  justify-self: start;
  display: flex;
  align-self: end;
  font-weight: bold;
}

.category {
  grid-area: category;
  text-align: left;
  align-self: center;
  justify-self: start;
}

.category p {
  margin: 0;
  color: #ffaa00;
}

.budgetlabel {
  grid-area: budgetlabel;
  align-self: center;
  justify-self: center;
}

.budget {
  grid-area: budget;
  align-self: start;
  justify-self: center;
  color: #ffaa00;
}

.userslabel {
  grid-area: userslabel;
  align-self: center;
  justify-self: center;
}

.users {
  grid-area: users;
  align-self: start;
  justify-self: center;
}

.users p {
  margin: 0;
  color: #ffaa00;
}

.descriptionlabel {
  grid-area: descriptionlabel;
  justify-self: center;
  display: flex;
  align-self: center;
  font-weight: bold;
}

.description {
  grid-area: description;
  text-align: center;
  font-style: italic;
  color: #ffaa00;
}

.buttonshow {
  background-color: #1e1c2c;
  grid-area: buttonshow;
  justify-self: center;
  align-self: center;
}

.buttonshow button {
  width: 7rem;
  cursor: pointer;
  text-align: center;
  color: white;
  background: #1e1c2c;
  border-radius: 25px;
  border: 2px solid rgba(255, 109, 0, 0.6);
  padding: 0.4rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: start;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

.buttonshow button:hover {
  background-color: #ff6d00;
  outline: none;
  font-weight: bold;
}

.buttonshow a {
  background-color: #ff6d00;
}

.showtripslist > div {
  font-size: 18px;
}

.showtripslist > div,
figure {
  background-color: #1e1c2c;
}

#link {
  background-color: #1e1c2c;
  text-decoration: none;
}

.icon {
  background-color: #1e1c2c;
  font-size: 18px;
}
</style>

