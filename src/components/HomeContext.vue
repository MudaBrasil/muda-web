<script setup lang="ts">
import imgTreeBackground from '@/assets/tree_background.png'
</script>

<template>
	<main>
		<div class="bg-image" :style="{ backgroundImage: `url(${imgTreeBackground})` }"></div>

		<div class="context">
			<div class="context-field">
				<h1 style="font-size: 40px">MUDA - CORRER AMANHA DE MANHA</h1>
				<a>Continue a nadar(mudar)!</a>
				<h2>O Muda vai virar todo esse jogo, o Muda é pra tudo, o Muda é pra todos!</h2>
				<br />

				<p>
					Criar scroll de cards horizontais com as tarefas pendentes para aquele dia Em baixo uma lista de tarefas que a
					pessoa tem para fazer (tem uma aba com as tarefas que ela ja realizou)
				</p>
				<br />

				<p>
					Quando a pessoa for se concentrar em uma tarefa mais longa ou que exiga mais, ela pode entra no modo super
					foco, onde aparece uma tela ou com mensagens motivacionais ou lembretes importantes da tarefa, nessa tela o
					ideal é ficar full screen e mostrar um pomodoro ou um cronometro de tempo, nesse modo a ideia é ser
					indistraivel
				</p>
				<br />
				<p>
					Caso a pessoa tenha dificuldade de se manter focada ou tem essa parte cognitiva atrofiada, ela pode usar um
					recurso que pergunta de 2 em 2 min se ela ainda esta na tarefa, e se ela nao tiver ele vai perguntando coisas
					pra tentar ajudar ela a voltar o foco, com o passar do tempo pode ser que o tempo de intervalo aumente.
				</p>
				<br />

				<img src="@/assets/logo.png" alt="Logo do Muda" />
				<br />
			</div>

			<div class="context-field">
				<h1>Colocar loading nas telas de login</h1>
				<a> </a>
				<br />
				<br />
			</div>

			<div class="context-field">
				<h1>Colocar todas tarefas que fiz</h1>
				<a
					>Não focar em colocar uma pontuação em cada tarefa, mas sim analisar o quanto de tarefa a pessoa completou de
					acordo com o que ela designou pra si</a
				>
				<br />
				<div class="d-flex jc-around">
					<div class="mr-20">
						<p>- Arrumei o quarto</p>
						<p>- Dobrei as roupas</p>
						<p>- Lavei a louça</p>
						<p>-</p>
					</div>
					<div>
						<p>- Reguei as plantas</p>
						<p>- Fiz as compras no mercado</p>
						<p>- Comprei terra pras plantas</p>
						<p>-</p>
					</div>
				</div>

				<br />
				<br />
			</div>

			<div class="context-field">
				<h1>Continuar o cronograma</h1>
				<a>Criar de 30 em 30 min</a>
				<br />
				<br />
			</div>

			<div class="context-field">
				<h1>Construir pomodoro</h1>
				<a>Criar botoes e customizar sons</a>
				<br />
				<br />
			</div>

			<div class="context-field">
				<h1>Acorda Mylow</h1>
				<a>Gravar audio motivacional para acordar bem</a>
				<br />
				<br />
			</div>

			<div class="card-header">
				<router-link to="/dashboard">Ir para dashboard</router-link>
			</div>
		</div>
	</main>
</template>

<style scoped lang="scss">
.context {
	padding-bottom: 140px;
	display: flex;
	align-items: center;
	flex-direction: column;
	background: linear-gradient(0deg, rgba(241, 246, 247, 1) 77%, rgba(144, 182, 47, 1) 100%);

	.context-field {
		padding: 20px;
		display: flex;
		align-items: center;
		flex-direction: column;

		img {
			max-width: 100px;
		}
	}
}
.bg-image {
	width: 100%;
	min-height: 234px;
}
</style>
