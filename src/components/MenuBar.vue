<script setup></script>

<template>
  <div class="main">
    <div class="floating-menu">
      <div class="floating-menu-bar-shadow"></div>
      <div class="floating-menu-circle-shadow"></div>
      <div class="floating-menu-circle"></div>
      <div class="floating-menu-circle-border"></div>

      <div class="floating-menu-options">
        <div class="floating-menu-options-btn active">
          <img src="@/assets/icons/home.svg" alt="Ícone de casa" />
        </div>
        <div class="floating-menu-options-btn">
          <img src="@/assets/icons/student-book.svg" alt="Ícone de livro de estudos" />
        </div>
        <div class="floating-menu-options-btn center-btn">
          <img src="@/assets/icons/plus.svg" alt="Ícone de adição" />
        </div>
        <div class="floating-menu-options-btn">
          <img src="@/assets/icons/social.svg" alt="Ícone de socialização" />
        </div>
        <div class="floating-menu-options-btn">
          <img src="@/assets/icons/progress.svg" alt="Ícone de progresso" />
        </div>
      </div>
      <div class="floating-menu-bar"></div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  bottom: 0px;
  position: fixed;
  z-index: 0;
}

.floating-menu {
  position: absolute;
  bottom: 0px;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, -50%);
}

.floating-menu-bar {
  position: relative;
  height: 64px;
  width: 324px;
  border-radius: 60px;
  background-color: white;
  border: solid 1px #f1f1f2;
  z-index: 100;
}

.floating-menu-bar-shadow {
  position: absolute;
  height: 64px;
  width: 324px;
  border-radius: 60px;
  box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15), 2px 4px 4px 0px rgba(0, 0, 0, 0.2);
  z-index: 98;
}

.floating-menu-circle {
  position: absolute;
  width: 76px;
  height: 76px;
  background-color: white;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
}

.floating-menu-circle-shadow {
  position: absolute;
  width: 78px;
  height: 78px;
  background-color: #f1f1f2;
  border-radius: 50%;
  /* box-shadow: ; */
  box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15), 2px 4px 4px 0px rgba(0, 0, 0, 0.2);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}

.floating-menu-circle-border {
  position: absolute;
  border-radius: 50%;
  width: 58px;
  height: 58px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid 2px #e2e2e2;
  z-index: 102;
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

.active {
  background-color: #f1f1f2;
}

/* @media (min-width: 1024px) {
} */
</style>
