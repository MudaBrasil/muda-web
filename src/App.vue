<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MenuBar from './components/MenuBar.vue'
import imgTreeBackground from './assets/tree_background.png'


</script>

<template>
  <!-- <header>
    <img alt="Muda logo" class="logo" src="/logo.png" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="Muda" />

      <nav>
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/about">Sobre</RouterLink>
      </nav>
    </div>
  </header> -->
        <!-- <RouterView /> -->

  <div>
    <MenuBar/>

    <div class="bg-image" :style="{backgroundImage: `url(${imgTreeBackground})`}">
    </div>
    
    <div class="context"> 
      <div class="context-field">
        <h1 style="font-size: 40px">MUDA</h1>
        <a href="">Continue a nadar(mudar)!</a>
        <br>
        <img src="@/assets/logo.png" alt="Logo do Muda">
        <br>
      </div>
  
      
      <div class="context-field">
        <h1>Continuar o cronograma</h1>
        <a href="">Criar de 30 em 30 min</a>
        <br>
        <br>
      </div>
      
      
      <div class="context-field">
        <h1>Construir pomodoro</h1>
        <a href="">Criar botoes e customizar sons</a>
        <br>
        <br>
      </div>
      
      <div class="context-field">
        <h1>Acorda Mylow</h1>
        <a href="">Gravar audio motivacional para acordar bem</a>
        <br>
        <br>
      </div>
    </div>
    
  </div>

</template>

<style scoped lang="scss">

.context {
  padding-bottom: 140px;
  display: flex;
  align-items: center;
  flex-direction: column;
  // background-image: linear-gradient(#90B62F, #F1F6F7);
  background: linear-gradient(0deg, rgba(241,246,247,1) 77%, rgba(144,182,47,1) 100%);

  .context-field {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      max-width: 100px;
    }
  }
}
.bg-image {
  width: 100%;
  min-height: 234px;
  // background-image: url('@/assets/tree_background.png');
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

</style>
