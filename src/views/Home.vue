<script setup lang="ts">
import HomeContext from '@/components/HomeContext.vue'
import Spaces from '@/components/Spaces.vue'
import TopBar from '@/components/TopBar.vue'
import { NFlex, NCard, NScrollbar } from 'naive-ui'
</script>

<template>
	<main style="max-width: 100%">
		<n-scrollbar trigger="hover" style="max-height: 100%">
			<HomeContext v-if="false" />
			<TopBar />
			<Spaces />

			<div class="cards-scrollbar">
				<n-flex class="m-10">
					<h3 style="color: rgb(83, 83, 83); font-size: 20px">Listas</h3>

					<n-scrollbar x-scrollable trigger="hover">
						<div class="d-flex ph-5" style="gap: 8px 12px">
							<n-card class="home-card">
								<h3>Ver cris no domingo</h3>
								<br />
								<p>
									Quasi, quibusdam. Lorem ipsum dolor sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem
									ipsum dolor sit amet cons ectetur adipi sicing elit.
								</p>
							</n-card>
							<n-card class="home-card">
								<h3>Fazer cronograma para a Carol</h3>
								<br />
								<p>
									Sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor sit amet cons ectetur
									adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor.
								</p>
							</n-card>
							<n-card class="home-card">
								<h3>Fazer trilha</h3>
								<br />
								<p>
									Lorem ipsum dolor sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor sit
									amet cons ectetur adipi sicing elit. Quasi, quibusdam.
								</p>
							</n-card>
						</div>
					</n-scrollbar>
				</n-flex>
			</div>

			<div class="pb-100"></div>
		</n-scrollbar>
	</main>
</template>

<style>
html {
	background-color: #f5f5f5 !important;
}
.cards-scrollbar {
	.n-scrollbar-container {
		background-image:
   /* Shadows */
			linear-gradient(to right, #f5f5f5, #f5f5f5),
			linear-gradient(to right, #f5f5f5, #f5f5f5),
			/* Shadow covers */ radial-gradient(ellipse at left, rgb(129, 129, 129, 0.4), transparent),
			radial-gradient(ellipse at right, rgba(179, 179, 179, 0.6), transparent);

		background-position:
			left center,
			right center,
			left center,
			right center;

		background-repeat: no-repeat;
		background-size:
			5px 100%,
			5px 100%,
			5px 99.6%,
			5px 99.6%;

		/* Opera doesn't support this in the shorthand */
		background-attachment: local, local, scroll, scroll;
	}
}
</style>

<style scoped lang="scss">
.muda-logo {
	font-family: 'Geologica', Inter, sans-serif;
	color: #1a9561;
	text-transform: uppercase;
	letter-spacing: -2px;
	font-size: 24px;
	font-weight: 900;
	text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}

.home-card {
	max-width: 250px;
	min-width: 250px;
	white-space: wrap;
	// margin: 0px 20px;
	z-index: -1;
}

.user-photo {
	border: 1px solid white;
	outline: 2px solid #1a9561;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}
</style>
