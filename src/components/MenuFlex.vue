<script setup>
import { useMenuFlexStore } from '@/stores/menuFlex'
const store = useMenuFlexStore()
</script>

<template>
  <div class="background" v-if="store.active">
    <div :class="['splash', { 'splash-active': store.active }]"></div>
    <div class="floating-menu">
      <div class="floating-menu-circle-border d-flex jc-center ai-center">
        <img
          src="@/assets/icons/plus-green.svg"
          alt="Ícone de adição"
          @click="store.active = false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.background {
  position: relative;
  height: 100%;
  z-index: 101;
  bottom: 0px;
  backdrop-filter: blur(2px) saturate(100%);
  -webkit-backdrop-filter: blur(2px) saturate(100%);
  background-color: rgba(0, 0, 0, 0.75);
}

// .splash {
//   position: absolute;
//   top: 40px;
//   right: 40px;
//   width: 50px;
//   height: 50px;
//
//   &::after {
//     content: '';
//     display: block;
//     position: absolute;
//     border-radius: 50%;
//     background-color: red;
//
//     // screen diameter can be 142vmax at most,
//     // circle needs to be twice that size to cover it
//     width: 284vmax;
//     height: 284vmax;
//     top: -142vmax;
//     left: -142vmax;
//
//     transform: scale(0);
//     transform-origin: 50% 50%;
//     transition: transform 0.5s cubic-bezier(0.755, 0.05, 0.855, 0.06);
//
//     // will-change tells the browser we plan to
//     // animate this property in the near future
//     will-change: transform;
//     &.splash-active {
//       > .splash::after {
//         transform: scale(1);
//       }
//     }
//   }
// }

.floating-menu {
  position: absolute;
  bottom: 64px;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, -50%);
}

.floating-menu-options {
  position: absolute;
  z-index: 104;
  height: 64px;
  width: 324px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7px;
}

.floating-menu-circle-border {
  position: absolute;
  border-radius: 50%;
  width: 58px;
  height: 58px;
  transform: translate(-50%, -50%);
  border: solid 3px rgba(255, 255, 255, 0.2);
  z-index: 102;
}

.floating-menu-options-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  cursor: pointer;
}

.center-btn {
  margin: 0px 12px;
}
</style>
