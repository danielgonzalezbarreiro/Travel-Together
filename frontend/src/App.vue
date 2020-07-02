<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@font-face {
  font-family: "Basier Square Regular";
  font-style: normal;
  font-weight: normal;
  src: local("Basier Square Regular"),
    url("assets/BasierSquare-Regular.woff") format("woff");
}

* {
  background-color: #1e1c2c;
  font-family: "Basier Square Regular";
  color: white;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
