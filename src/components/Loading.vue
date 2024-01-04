<template>
	<transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" :class="componentClass">
		<div v-if="showing" :class="{ [overlayClass]: overlay }">
			<slot name="loading-container">
				<div :class="loaderClass">
					<slot name="loading-text" v-if="showLabel">
						<div class="pulled-left" v-html="label"></div>
					</slot>
					<slot name="loading-spinner">
						<div class="wrapper">
							<div class="spinner-container">
								<div class="spinner-layer spinner-layer--blue">
									<div class="spinner-clipper spinner-clipper--left">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner--patch">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner-clipper spinner-clipper--right">
										<div class="spinner-circle"></div>
									</div>
								</div>

								<div class="spinner-layer spinner-layer--red">
									<div class="spinner-clipper spinner-clipper--left">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner--patch">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner-clipper spinner-clipper--right">
										<div class="spinner-circle"></div>
									</div>
								</div>

								<div class="spinner-layer spinner-layer--yellow">
									<div class="spinner-clipper spinner-clipper--left">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner--patch">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner-clipper spinner-clipper--right">
										<div class="spinner-circle"></div>
									</div>
								</div>

								<div class="spinner-layer spinner-layer--green">
									<div class="spinner-clipper spinner-clipper--left">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner--patch">
										<div class="spinner-circle"></div>
									</div>
									<div class="spinner-clipper spinner-clipper--right">
										<div class="spinner-circle"></div>
									</div>
								</div>
							</div>
						</div>
					</slot>
				</div>
			</slot>
		</div>
	</transition>
</template>

<script setup lang="ts">
// My regards to the real creator of this component. (https://github.com/PygmySlowLoris/vue-full-loading)
import { useEmitter } from '@/emitter'
import { onMounted, ref, watch } from 'vue'

const { emitter } = useEmitter()

const props = defineProps({
	label: { default: 'Carregando...' },
	show: { default: false },
	showLabel: { default: false },
	overlay: { default: false },
	eventBus: { default: null, type: Boolean },
	eventShow: { default: 'show-full-loading' },
	eventHide: { default: 'hide-full-loading' },
	loaderClass: { default: 'pulled-center' },
	overlayClass: { default: 'white-overlay' },
	componentClass: { default: 'loading' }
})

const showing = ref(props.show)

function registerBusMethods() {
	emitter.on(props.eventShow, () => (showing.value = true))
	emitter.on(props.eventHide, () => (showing.value = false))
}

watch(
	() => props.show,
	val => (showing.value = val)
)
onMounted(() => {
	props.eventBus && registerBusMethods()
})
</script>

<style scoped>
.minimal-loading {
	position: absolute;
}

.loading {
	position: absolute;
	height: 100%;
	width: 100%;
}

.white-overlay {
	background-color: rgba(0, 0, 0, 0.61);
	z-index: 1000;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	position: fixed;
	margin: 0 auto;
}

.component-overlay {
	background-color: rgba(0, 0, 0, 0.61);
	z-index: 1000;
	height: 100%;
	width: 100%;
}

.loader-wrapper {
	position: absolute;
	display: inline-block;
	right: 10vw;
	bottom: 10vh;
}

.pulled-left {
	float: left;
	padding: 10px 20px;
}

.pulled-right {
	float: right;
	padding: 10px 20px;
}

.pulled-center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

*,
*:before,
*:after {
	box-sizing: border-box;
}

.wrapper {
	position: relative;
	display: inline-block;
	width: 36px;
	height: 36px;
	font-size: 0;
}

.spinner-container {
	width: 100%;
	height: 100%;
	-webkit-animation: container-rotate 1568ms linear infinite;
	animation: container-rotate 1568ms linear infinite;
}

@keyframes container-rotate {
	to {
		transform: rotate(360deg);
	}
}

.spinner-layer {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.spinner-layer--blue {
	border-color: #4285f4; /* #4285f4  TODO: Transform this color in main palete*/
	-webkit-animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.spinner-layer--red {
	border-color: #db4437; /* #db4237  TODO: Transform this color in main palete*/
	-webkit-animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.spinner-layer--yellow {
	border-color: #f4b400; /* #f4b442  TODO: Transform this color in main palete*/
	-webkit-animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.spinner-layer--green {
	border-color: #0f9d58; /* #0f9d42  TODO: Transform this color in main palete*/
	-webkit-animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation:
		fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both,
		green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes fill-unfill-rotate {
	12.5% {
		transform: rotate(135deg);
	}

	25% {
		transform: rotate(270deg);
	}

	37.5% {
		transform: rotate(405deg);
	}

	50% {
		transform: rotate(540deg);
	}

	62.5% {
		transform: rotate(675deg);
	}

	75% {
		transform: rotate(810deg);
	}

	87.5% {
		transform: rotate(945deg);
	}

	to {
		transform: rotate(1080deg);
	}
}

@keyframes blue-fade-in-out {
	from {
		opacity: 1;
	}

	25% {
		opacity: 1;
	}

	26% {
		opacity: 0;
	}

	89% {
		opacity: 0;
	}

	90% {
		opacity: 1;
	}

	100% {
		opacity: 1;
	}
}

@keyframes red-fade-in-out {
	from {
		opacity: 0;
	}

	15% {
		opacity: 0;
	}

	25% {
		opacity: 1;
	}

	50% {
		opacity: 1;
	}

	51% {
		opacity: 0;
	}
}

@keyframes yellow-fade-in-out {
	from {
		opacity: 0;
	}

	40% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	75% {
		opacity: 1;
	}

	76% {
		opacity: 0;
	}
}

@keyframes green-fade-in-out {
	from {
		opacity: 0;
	}

	65% {
		opacity: 0;
	}

	75% {
		opacity: 1;
	}

	90% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}

.spinner-clipper {
	position: relative;
	display: inline-block;
	width: 50%;
	height: 100%;
	overflow: hidden;
	border-color: inherit;
}

.spinner-circle {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 200%;
	height: 100%;
	border-color: inherit;
	border-bottom-color: transparent !important;
	border-style: solid;
	border-width: 4px;
	border-radius: 50%;
	-webkit-animation: none;
	animation: none;
}

.spinner-clipper--left .spinner-circle {
	border-right-color: transparent !important;
	transform: rotate(129deg);
	-webkit-animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.spinner-clipper--right .spinner-circle {
	left: -100%;
	border-left-color: transparent !important;
	transform: rotate(-129deg);
	-webkit-animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
	animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes left-spin {
	from {
		transform: rotate(80deg);
	}

	50% {
		transform: rotate(-5deg);
	}

	to {
		transform: rotate(80deg);
	}
}

@keyframes right-spin {
	from {
		transform: rotate(-100deg);
	}

	50% {
		transform: rotate(20deg);
	}

	to {
		transform: rotate(-100deg);
	}
}

.spinner--patch {
	position: absolute;
	top: 0;
	left: 45%;
	width: 10%;
	height: 100%;
	overflow: hidden;
	border-color: inherit;
}

.spinner--patch .spinner-circle {
	left: -450%;
	width: 1000%;
}
</style>
