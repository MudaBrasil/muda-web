<script setup>
import { useMenuFlexStore } from '@/stores/menuFlex'
const store = useMenuFlexStore()
</script>

<template>
  <div class="menu-flex" :class="[{ active: store.active }]">
    <div class="body">
      <div class="content"></div>
      <div class="floating-menu-flex">
        <div
          class="floating-menu-flex-circle-border d-flex jc-center ai-center cursor-pointer"
          @click="store.active = false"
        >
          <img src="@/assets/icons/plus-green.svg" alt="Ícone de adição" class="img-close-menu" />
        </div>
      </div>
    </div>
    <div class="splash"></div>
  </div>
</template>

<style lang="scss">
.menu-flex {
  position: relative;
  height: 100%;
  z-index: 101;
  bottom: 0px;

  &.active {
    .body {
      transition: opacity 1s;
      transform: scale3d(1, 1, 1);
      opacity: 1;

      .floating-menu-flex {
        .img-close-menu {
          opacity: 1;
          transform: rotate(135deg);
          transition: transform 0.2s;
        }
      }
    }

    .splash {
      &::after {
        transform: scale3d(1, 1, 1);
        transition: transform 0.2s ease-out;
      }
    }
  }

  .body {
    opacity: 90%;
    position: relative;
    transform: scale3d(0, 0, 0);
    z-index: 200;
    height: 100%;
    transition-delay: 0.3s;
    will-change: transform, opacity;

    .content {
      height: 88%;
    }

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
        will-change: transform, opacity;
        transition: transform 0.5s, opacity 0.1s 0.2s;
      }
    }
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

      transform: scale3d(0, 0, 0);
      transform-origin: 50% 50%;
      will-change: transform;
      transition: transform 0.2s ease-in;
    }
  }
}
</style>
