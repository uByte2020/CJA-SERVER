<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Solicitações</h4>
            <p class="category">Solicitações Realizadas</p>
          </md-card-header>
          <md-card-content>
            <solicitacao-table :solicitacoes="getSolicitacoes" table-header-color="green"></solicitacao-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SolicitacaoTable } from '@/pages';

export default {
  components: {
    SolicitacaoTable,
  },
  methods: {
    async fetchSolicitacoes() {
      try {
        await this.$store.dispatch('solicitacaoStore/getSolicitacoes');
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
  },
  created() {
    const loader = this.$loading.show({
      color: '#4caf50',
      opacity: 0.3,
    });
    (async () => {
      await this.fetchSolicitacoes();
      loader.hide();
    })();
  },
  computed: {
    getSolicitacoes() {
      return this.$store.getters['solicitacaoStore/getSolicitacoes'];
    },
  },
};
</script>
