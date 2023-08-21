<script setup>
import imgTreeBackground from '@/assets/tree_background.png'
</script>

<template>
  <main>
    <div class="bg-image" :style="{ backgroundImage: `url(${imgTreeBackground})` }"></div>

    <div class="context">
      <div class="context-field">
        <h1 style="font-size: 40px">MUDA</h1>
        <a>Continue a nadar(mudar)!</a>
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
          >Não focar em colocar uma pontuação em cada tarefa, mas sim analisar o quanto de tarefa a
          pessoa completou de acordo com o que ela designou pra si</a
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
