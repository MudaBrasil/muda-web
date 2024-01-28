<script setup lang="ts">
import MenuFlex from '@/components/MenuFlex.vue'
import { useMenuFlexStore } from '@/stores/menuFlex'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import homeIcon from '@/assets/icons/home.svg'
import studentBookIcon from '@/assets/icons/student-book.svg'
import plusIcon from '@/assets/icons/plus.svg'
import socialIcon from '@/assets/icons/social.svg'
import progressIcon from '@/assets/icons/progress.svg'

const store = useMenuFlexStore()

const router = useRouter()
const route = useRoute()

const menuOptions = ref([
	{
		icon: homeIcon,
		title: 'Home',
		alt: 'Ícone de casa',
		path: '/',
		active: route.path === '/',
		click: () => router.push({ path: '/' })
	},

	{
		icon: socialIcon,
		title: 'Social',
		alt: 'Ícone de socialização',
		path: '/dashboard',
		active: route.path === '/dashboard',
		click: () => router.push({ path: '/dashboard' })
	},
	{
		icon: plusIcon,
		title: 'Menu de adição',
		alt: 'Ícone de adição',
		path: '',
		active: store.active,
		class: 'center-btn img-close-menu',
		click: () => (store.active = true)
	},
	{
		icon: progressIcon,
		title: 'Progresso',
		alt: 'Ícone de progresso',
		path: '/timeline',
		active: route.path.includes('timeline'),
		click: () => router.push({ name: 'timeline' })
	},
	{
		icon: studentBookIcon,
		title: 'Livro de estudos',
		alt: 'Ícone de livro de estudos',
		path: '/rennan',
		active: route.path === '/rennan',
		click: () => router.push({ path: '/rennan' })
	}
])

watch(
	() => route.path,
	path => {
		menuOptions.value.forEach(option => {
			if (option.path === '' || !option.path) return
			if (option.path === '/') return (option.active = path === option.path)

			option.active = path.includes(option.path)
		})
	}
)

watch(
	() => store.active,
	active => {
		if (menuOptions) {
			menuOptions.value[2].active = active
		}
	}
)
</script>

<template>
	<div class="menu-background" :class="['menu-background', { 'h-100d': store.active }]">
		<MenuFlex />
		<div class="floating-menu">
			<div class="floating-menu-bar-shadow"></div>
			<div class="floating-menu-circle-shadow"></div>
			<div class="floating-menu-circle"></div>
			<div class="floating-menu-circle-border"></div>

			<div class="floating-menu-options">
				<div
					v-for="(option, index) in menuOptions"
					:key="index"
					:class="['floating-menu-options-btn', option?.class, { active: option.active }]"
					@click="option.click"
				>
					<img :src="option.icon" :alt="option.alt" />
				</div>
			</div>
			<div class="floating-menu-bar"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.menu-background {
	width: 100%;
	bottom: 0px;
	position: fixed;
	z-index: 100;
	user-select: none;
}

.floating-menu {
	position: absolute;
	bottom: 0px;
	z-index: 100;
	left: 50dvw;
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
	box-shadow:
		0 1px 3px 1px rgba(60, 64, 67, 0.15),
		2px 4px 4px 0px rgba(0, 0, 0, 0.2);
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
	box-shadow:
		0 1px 3px 1px rgba(60, 64, 67, 0.15),
		2px 4px 4px 0px rgba(0, 0, 0, 0.2);
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
	border: solid 3px #e2e2e2;
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
	filter: grayscale(1) opacity(0.8);
	transition: background-color 0.2s ease-in;

	&.active {
		filter: grayscale(0);
		background-color: #f1f1f2;

		img {
			filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
		}
	}
}

.center-btn {
	// margin: 0px 12px;
}

.img-close-menu {
	transform: rotate(0deg);
	will-change: transform;
	transition: transform 0.5s;

	&.active {
		transform: rotate(135deg);
		transition: transform 0.2s;
	}
}

/* @media (min-width: 1024px) {
} */
</style>
