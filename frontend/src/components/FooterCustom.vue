<template>
  <div class="footercustom">
    <router-link id="link" :to="{ name: 'About'}">
      <p>Daniel González Barreiro © 2020 - Hack a Boss</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
  data() {
    return {};
  }
};
</script>

<style>
.footercustom {
  color: white;
  background-color: #1e1c2c;
  height: 50px;
}

.footercustom p {
  margin-top: 1rem;
  opacity: 0.5;
  transition: 0.3s;
}

.footercustom p:hover {
  opacity: 1;
  color: #ff6d00;
}

.footercustom a {
  text-decoration: none;
}
</style>