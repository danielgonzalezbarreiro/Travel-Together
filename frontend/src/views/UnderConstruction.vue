<template>
  <div class="construction">
    <vue-headful title="Under Construction" description="Under Construction page" />
    <h1>503</h1>
    <h2>UNDER CONSTRUCTION</h2>
    <h3>Esta página estará disponible pronto!</h3>
    <router-link class="link" id="link" :to="{ name: 'Trips'}">
      <button>HOME</button>
    </router-link>
  </div>
</template>

<script>
export default {
  Name: "UnderConstruction"
};
</script>

<style scoped>
.construction {
  text-align: center;
  align-self: center;
  margin-top: 15rem;
}

h1 {
  font-size: 100px;
  color: #ff6d00;
}

h2 {
  font-size: 50px;
  padding: 1rem;
}

h3 {
  margin-bottom: 3rem;
  color: #ff6d00;
  font-style: italic;
}

button {
  width: 13rem;
  height: 2.5rem;
  cursor: pointer;
  text-align: center;
  color: white;
  border: 2px solid rgba(255, 109, 0, 0.6);
  background: #1e1c2c;
  border-radius: 25px;
  padding: 0.3rem;
  margin: 1.5rem;
  font-weight: bold;
  align-self: center;
  justify-self: center;
  outline: none;
  transition: 0.3s;
}

button:hover {
  background: #ff6d00;
}
</style>