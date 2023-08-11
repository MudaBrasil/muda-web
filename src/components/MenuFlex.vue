<script setup>
import { useMenuFlexStore } from '@/stores/menuFlex'
const store = useMenuFlexStore()
</script>

<template>
  <div class="background">
    <div class="splash" :style="`--scale:${store.active ? 1 : 0}`" />
    <div class="menu-flex" v-if="store.active">
      <div class="content"></div>
      <div class="floating-menu" :style="`--scale:${store.active ? 1 : 0}`">
        <div class="floating-menu-circle-border d-flex jc-center ai-center">
          <img
            src="@/assets/icons/plus-green.svg"
            alt="Ícone de adição"
            @click="store.active = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.menu-flex {
  height: 100%;
  width: 100%;
}

.content {
  height: 88%;
}

.background {
  position: relative;
  height: 100%;
  z-index: 101;
  bottom: 0px;
}

.splash {
  position: absolute;
  bottom: 64px;
  right: 50%;
  width: 1px;
  height: 1px;
  z-index: 100;

  &::after {
    content: '';
    display: block;
    position: absolute;
    border-radius: 50%;
    backdrop-filter: blur(2px) saturate(100%);
    -webkit-backdrop-filter: blur(2px) saturate(100%);
    background-color: rgba(0, 0, 0, 0.75);

    // screen diameter can be 142vmax at most,
    // circle needs to be twice that size to cover it
    width: 284vmax;
    height: 284vmax;
    top: -142vmax;
    left: -142vmax;

    transform: scale(var(--scale));
    transform-origin: 50% 50%;
    transition: transform 0.3s cubic-bezier(0.755, 0.05, 0.855, 0.06);

    // will-change tells the browser we plan to
    // animate this property in the near future
    will-change: transform;
  }
}

// Corrigir transição da opacidade
.floating-menu {
  position: absolute;
  bottom: 64px;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: var(--scale);

  -webkit-transition: opacity 1s ease-in-out;
  -moz-transition: opacity 1s ease-in-out;
  -ms-transition: opacity 1s ease-in-out;
  -o-transition: opacity 1s ease-in-out;
  transition: opacity 1s ease-in-out;

  .floating-menu-circle-border {
    position: absolute;
    border-radius: 50%;
    width: 58px;
    height: 58px;
    transform: translate(-50%, -50%);
    border: solid 3px rgba(255, 255, 255, 0.2);
    z-index: 102;
  }
}
</style>
