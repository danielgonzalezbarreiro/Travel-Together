<template>
  <div class="about">
    <vue-headful title="About" description="Sobre Travel Together..." />
    <header>
      <router-link :to=" {name:'Trips'} ">
        <h1>Travel Together</h1>
      </router-link>
      <h3>Social web donde podes atopar xente para viaxar</h3>
      <p>Proxecto final HACK A BOSS desenvolvido por:</p>
    </header>
    <section class="profile">
      <img src="../assets/fotoabout.jpg" alt="Foto del desarrollador" />
      <h2>Daniel González Barreiro</h2>
      <p>Técnico superior en desenvolvemento é mantemento electrónico</p>
    </section>

    <section class="bio">
      <p>Apasionado da tecnoloxía en todos os seus ambitos</p>
      <p>Maker en electrónica e robótica explorando o mundo do software e do desenvolvemento web</p>
    </section>

    <h2>Tecnoloxías</h2>
    <section class="tech">
      <div class="frontend">
        <h3>Frontend</h3>
        <p>Vue</p>
        <p>Javascript</p>
        <p>HTML</p>
        <p>CSS</p>
      </div>
      <div class="backend">
        <h3>Backend</h3>
        <p>NodeJS</p>
        <p>MySQL</p>
        <p>Express</p>
        <p>Sendgrid</p>
      </div>
    </section>

    <section class="icons">
      <a href="https://www.linkedin.com/in/danielgonzalezbarreiro/">
        <img src="../assets/icons/linkedin.png" alt="Icono linkedin" />
      </a>
      <a href="https://github.com/danielgonzalezbarreiro">
        <img src="../assets/icons/github.png" alt="Icono github" />
      </a>
      <a href="https://twitter.com/DaaniBarreiro">
        <img src="../assets/icons/twitter.png" alt="Icono twitter" />
      </a>
    </section>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped>
.about {
  text-align: center;
  align-self: center;
  margin-top: 3rem;
}

.about h1 {
  margin-bottom: 2rem;
  color: #ff6d00;
  opacity: 0.7;
  transition: 0.3s;
}

.about h1:hover {
  opacity: 1;
}

.about a {
  text-decoration: none;
  opacity: 0.5;
  transition: 0.3s;
}

header p {
  margin-top: 1rem;
}

.profile {
  margin-top: 2rem;
}

.profile img {
  height: 200px;
  width: 200px;
  border-radius: 50%;
}

.profile h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-style: italic;
}
h2 {
  color: #ff6d00;
}

.profile p {
  font-size: 20px;
}

.bio {
  margin: 3rem;
}
.bio p {
  padding: 0.25rem;
}

.tech {
  display: flex;
  justify-content: center;
}

.frontend {
  padding: 1rem;
}

.frontend h3 {
  margin-bottom: 0.5rem;
}

.backend {
  padding: 1rem;
}

.backend h3 {
  margin-bottom: 0.5rem;
}

.icons {
  color: white;
  margin-top: 3rem;
}

.icons img {
  height: 50px;
  width: 50px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s;
  margin: 0 1rem;
}

.icons img:hover {
  opacity: 1;
}
</style>