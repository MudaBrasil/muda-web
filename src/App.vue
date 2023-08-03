<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
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
  <div class="main">
    <div class="floating-menu">      
      <div class="floating-menu-bar-shadow">
      </div>
      <div class="floating-menu-circle-shadow">
      </div>
      <div class="floating-menu-bar">
        <div class="floating-menu-circle">
        </div>
        
        <div class="floating-menu-circle-border">
        </div>
      </div>
    </div>
    <!-- <RouterView /> -->
  </div>
</template>

<style scoped lang="scss">
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
