<template>
  <div class="reellist">
    <div class="showreellist" v-for="photo in reel" :key="photo.id">
      <figure class="profile">
        <nav>
          <router-link id="link" :to="{ name: 'Profile', params:{ id: photo.user_id }}">
            <img :src="photo.avatar_img ? path + photo.avatar_img : defaultAvatar" alt />
          </router-link>
        </nav>
        <nav>
          <router-link
            id="link"
            :to="{ name: 'Profile', params:{ id: photo.user_id }}"
          >{{ photo.profile_name }}</router-link>
          <p>{{'@' + photo.user_login}}</p>
        </nav>
      </figure>

      <div class="photodate">{{photo.create_photo.substr(0,10)}}</div>

      <figure class="photo">
        <router-link id="link" :to="{ name: 'PhotoView', params:{ id: photo.id }}">
          <img :src="path + photo.photo" alt />
        </router-link>
      </figure>

      <section class="phototext">
        <p>{{'@' + photo.user_login + ':'}}</p>
        {{photo.text}}
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShowReelList",
  data() {
    return {
      defaultAvatar: "http://localhost:3001/uploads/defaultAvatar.png",
      path: "http://localhost:3001/uploads/",
      showInfo: true,
      userID: 0
    };
  },
  props: {
    reel: Array
  },
  methods: {}
};
</script>
<style scoped>
* {
  font-family: "Basier Square Regular";
  background-color: #0f0e1d;
}

.showreellist {
  width: 650px;
  height: 600px;
  margin: 0 auto;
  margin-top: 1rem;
  padding: 0.25rem;
  background-color: #1e1c2c;
  color: white;
  border-radius: 25px;
  justify-self: center;
  align-self: center;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 15% 67% 35%;
  gap: 1px 1px;
  grid-template-areas: "profile photodate" "photo photo" "phototext phototext";
}

.profile {
  background-color: #1e1c2c;
  grid-area: profile;
  margin-left: 0.4rem;
  display: flex;
  border-radius: 25px;
}

.profile nav {
  background-color: #1e1c2c;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
}

.profile a {
  background-color: #1e1c2c;
  text-decoration: none;
  font-weight: bold;
}

.profile a:hover {
  color: #ffaa00;
  transition: 0.3s;
}

.profile p {
  background-color: #1e1c2c;
  color: gray;
}

.profile img {
  width: 50px;
  height: 50px;
  border: 2px solid #ffaa00;
  border-radius: 50%;
  margin: 1rem 1rem;
  justify-content: center;
}

.photo {
  grid-area: photo;
  justify-self: center;
  align-self: center;
}

.photo img {
  width: 600px;
  height: 400px;
  transition: 0.3s;
}

.photo img:hover {
  opacity: 0.8;
  box-shadow: 10px 10px rgba(15, 14, 29, 0.7);
}

.phototext {
  grid-area: phototext;
  background-color: #1e1c2c;
  justify-self: start;
  align-self: start;
  padding: 0.5rem 1.5rem;
  display: flex;
  color: #ffaa00;
}

.phototext p {
  background-color: #1e1c2c;
  margin-right: 0.5rem;
  color: gray;
}

.photodate {
  grid-area: photodate;
  background-color: #1e1c2c;
  color: gray;
  align-self: center;
  justify-self: end;
  margin-right: 2rem;
}
</style>

