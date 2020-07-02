<template>
  <div>
    <div class="profile">
      <img
        class="profileavatar"
        :src="profile.avatar_img ? path + profile.avatar_img : defaultAvatar"
        alt
      />
      <div class="profilename">
        <h3>{{ profile.profile_name }}</h3>
      </div>

      <div class="userlogin">
        <p>{{'@'+ profile.user_login}}</p>
      </div>

      <figure class="localitylabel">
        <font-awesome-icon class="icon" icon="map-marker-alt" />
      </figure>
      <div class="locality">
        <p>{{profile.locality}}</p>
      </div>

      <figure class="birthdaylabel">
        <font-awesome-icon class="icon" icon="birthday-cake" />
      </figure>
      <div class="birthday">
        <p>{{profile.birthday ? profile.birthday.substr(0,10) : ""}}</p>
      </div>

      <figure class="followerslabel">Followers</figure>
      <div class="followers">
        <p>{{followers.length}}</p>
      </div>

      <figure class="biographylabel">Bio</figure>
      <div class="biography">
        <p>{{"'" + profile.biography +"'"}}</p>
      </div>

      <figure class="ratinglabel">
        <font-awesome-icon class="icon" icon="star-half-alt" />
      </figure>
      <div class="rating">
        <star-rating
          :rating="rate_media"
          :read-only="true"
          :increment="0.01"
          :star-size="35"
          inactive-color="#423f57"
          active-color="#ffaa00"
          :border-width="3"
        ></star-rating>
      </div>

      <!--       <div class="rates" v-for="(rate, index) in rates" :key="rate.id">
        <p>{{rates[index].profile_name}}</p>
        <p>{{rates[index].points}}</p>
        <p>{{rates[index].rate_text}}</p>
      </div>-->
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import { getUserName } from "@/api/utils";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMapMarkerAlt,
  faStarHalfAlt,
  faBirthdayCake
} from "@fortawesome/free-solid-svg-icons";

library.add(faMapMarkerAlt, faStarHalfAlt, faBirthdayCake);

export default {
  name: "ProfileComponent",
  components: { StarRating },
  data() {
    return {
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      showInfo: true,
      userID: 0
    };
  },
  props: {
    profile: Object,
    rates: Array,
    followers: Array,
    rate_media: Number
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
  },
  bedoreCreate() {
    this.checkInfo();
  }
};
</script>

<style scoped>
* {
  font-family: "Basier Square Regular";
}

.profile {
  font-size: 20px;
  margin: 2rem;
  background-color: #1e1c2c;
  color: white;
  height: 40rem;
  width: 30rem;
  display: grid;
  grid-template-columns: 50%;
  grid-template-rows: 28% 5% 7% 6% 7% 5% 12% 5% 15% 7%;
  gap: 1px 1px;
  grid-template-areas: "profileavatar profileavatar" "profilename profilename" "userlogin userlogin" "localitylabel birthdaylabel" "locality birthday" "biographylabel biographylabel" "biography biography" "followerslabel followerslabel" "followers followers" "ratinglabel ratinglabel" "rating rating";
}
.icon {
  font-size: 26px;
}

.profileavatar {
  grid-area: profileavatar;
  width: 150px;
  height: 150px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  margin: 1rem auto;
}

.profilename {
  grid-area: profilename;
  justify-self: center;
}

.userlogin {
  grid-area: userlogin;
  justify-self: center;
}

.userlogin p {
  color: gray;
  font-style: italic;
}

.biographylabel {
  grid-area: biographylabel;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.biography {
  grid-area: biography;
  justify-self: center;
}

.biography p {
  color: lightgray;
  font-style: italic;
}

.localitylabel {
  grid-area: localitylabel;
  text-align: center;
  font-weight: bold;
}

.locality {
  grid-area: locality;
  justify-self: center;
}

.birthdaylabel {
  grid-area: birthdaylabel;
  text-align: center;
  font-weight: bold;
}

.birthday {
  grid-area: birthday;
  justify-self: center;
}

.followers {
  grid-area: followers;
  justify-self: center;
}

.followerslabel {
  grid-area: followerslabel;
  justify-self: center;
  font-size: 22px;
  font-weight: bold;
}
.followers p {
  color: lightgray;
}

.rating {
  grid-area: rating;
  justify-self: center;
}

.ratinglabel {
  grid-area: ratinglabel;
  justify-self: center;
}
</style>