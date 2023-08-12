<script setup>
import { useMenuFlexStore } from '@/stores/menuFlex'
const store = useMenuFlexStore()
</script>

<template>
  <div class="background">
    <div class="menu-flex" :class="[{ active: store.active }]">
      <div class="content"></div>
      <div class="floating-menu-flex" :style="`--scale:${store.active ? 1 : 0}`">
        <div
          class="floating-menu-flex-circle-border d-flex jc-center ai-center cursor-pointer"
          @click="store.active = false"
        >
          <img
            src="@/assets/icons/plus-green.svg"
            alt="Ícone de adição"
            :class="['img-close-menu', { active: store.active }]"
          />
        </div>
      </div>
    </div>
    <div class="splash" :style="`--scale:${store.active ? 1 : 0}`" />
  </div>
</template>

<style lang="scss">
.menu-flex {
  opacity: 90%;
  position: relative;
  transform: scale(0);
  z-index: 200;
  height: 100%;
  transition-delay: 0.3s;
  will-change: opacity;

  &.active {
    transition: opacity 1s;
    transform: scale(1);
    opacity: 1;
  }
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
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, 0.7);

    width: 210vmax;
    height: 210vmax;
    top: -105vmax;
    left: -105vmax;

    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;

    transform: scale3d(var(--scale), var(--scale), 1);
    transform-origin: 50% 50%;
    will-change: transform;
    transition: transform 0.2s ease-out;
  }
}

// Corrigir transição da opacidade
.floating-menu-flex {
  position: absolute;
  bottom: 64px;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, -50%);

  .floating-menu-flex-circle-border {
    position: absolute;
    border-radius: 50%;
    width: 58px;
    height: 58px;
    transform: translate(-50%, -50%);
    border: solid 3px rgba(255, 255, 255, 0.2);
    z-index: 102;
  }

  .img-close-menu {
    transform: rotate(0deg);
    opacity: 0;
    will-change: transform;
    transition: transform 0.5s, opacity 0.1s 0.2s;

    &.active {
      opacity: 1;
      transform: rotate(135deg);
      transition: transform 0.2s;
    }
  }
}
</style>
