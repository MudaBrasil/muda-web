<script setup>
import { useMenuFlexStore } from '@/stores/menuFlex'
import { NButton, NInput, NInputGroup, NIcon, NCard } from 'naive-ui'

const store = useMenuFlexStore()
</script>

<template>
  <div class="menu-flex" :class="[{ active: store.active }]">
    <div class="body">
      <div class="content">
        <h1>Pesquise por texto ou voz</h1>
        <n-input-group>
          <n-input placeholder="O que deseja encontrar?" />
          <n-button type="primary">
            <n-icon size="24">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3zM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8z"
                  fill="currentColor"
                ></path>
              </svg>
            </n-icon>
          </n-button>
        </n-input-group>
        <n-button type="primary" class="mt-10">Procurar</n-button>
        <n-button type="info" class="ml-10">Procurar por voz</n-button>

        <br />
        <br />
        <br />
        <h1>Histórico</h1>
        <br />
        <div class="d-flex">
          <n-card title="Semana passada" class="mr-5"> Lorem isquam, voluptatum. </n-card>

          <n-card title="Mês passado" class="ml-5"> Lorem ipsum dolor sit amet. </n-card>
        </div>
        <br />
        <br />
        <br />
        <h1>Amigos e redes sociais</h1>
        <br />

        <n-card title="Pablo Gonzalez aceitou sua solicitação">
          Agora voce e Pablo são amigos e podem compartilhar informações.
        </n-card>
        <br />

        <n-card title="Pablo Gonzalez aceitou sua solicitação">
          Agora voce e Pablo são amigos e podem compartilhar informações.
        </n-card>
        <br />

        <br />
        <br />
        <br />
        <h1>Estatísticas</h1>
        <div class="d-flex jc-center">
          <img src="@/assets/logo.png" alt="Logo do Muda" height="150" />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
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
  height: 0px;
  z-index: 0;
  bottom: 0px;
  transition: z-index 0s 0.2s;
  will-change: z-index;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #15be77;
    margin-bottom: 4px;
  }

  .body {
    display: flex;
    opacity: 90%;
    position: relative;
    transform: scale3d(0, 0, 0);
    z-index: 200;
    height: 100%;
    transition-delay: 0.3s;
    will-change: transform, opacity;

    .content {
      position: relative;
      transform: scale3d(0, 0, 1);
      padding: 0px;
      opacity: 0;
      overflow-y: scroll;
      flex: 1;
      will-change: transform, padding, opacity;
      transition: transform 0.2s 0s;
      max-height: calc(100% - 130px);
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

  &.active {
    z-index: 101;
    transition: none;
    height: 100%;

    .body {
      transition: opacity 1s;
      transform: scale3d(1, 1, 1);
      opacity: 1;

      .content {
        opacity: 1;
        padding: 30px 30px;
        transform: scale3d(1, 1, 1);
        transition: transform 0.1s 0.05s;
      }

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
}
</style>
