<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NNotificationProvider, NDialogProvider, NLoadingBarProvider } from 'naive-ui'

console.log(
	'%c' + 'Bem vindo ao MUDA!',
	'color: #15BE77; -webkit-text-stroke: 3px black; font-size: 60px; font-weight: bold;'
)
</script>

<template>
	<NNotificationProvider :max="3" :keep-alive-on-hover="true">
		<NDialogProvider>
			<NLoadingBarProvider>
				<RouterView></RouterView>
			</NLoadingBarProvider>
		</NDialogProvider>
	</NNotificationProvider>
</template>

<style scoped lang="scss">
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style scoped lang="scss">
// header {
//   line-height: 1.5;
//   max-height: 100vh;
// }

// .logo {
// display: block;
//   margin: 0 auto 2rem;
// }

// nav {
//   width: 100%;
//   font-size: 12px;
//   text-align: center;
//   margin-top: 2rem;
// }

// nav a.router-link-exact-active {
//   color: var(--color-text);
// }

// nav a.router-link-exact-active:hover {
//   background-color: transparent;
// }

// nav a {
//   display: inline-block;
//   padding: 0 1rem;
//   border-left: 1px solid var(--color-border);
// }

// nav a:first-of-type {
//   border: 0;
// }

// @media (min-width: 1024px) {
//   header {
//     display: flex;
//     place-items: center;
//     padding-right: calc(var(--section-gap) / 2);
//   }

//   .logo {
//     margin: 0 2rem 0 0;
//   }

//   header .wrapper {
//     display: flex;
//     place-items: flex-start;
//     flex-wrap: wrap;
//   }

//   nav {
//     text-align: left;
//     margin-left: -1rem;
//     font-size: 1rem;

//     padding: 1rem 0;
//     margin-top: 1rem;
//   }
// }
</style>
