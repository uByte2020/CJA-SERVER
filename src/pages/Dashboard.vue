<template>
  <div class="content">
    <notifications></notifications>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>notifications</md-icon>
          </template>

          <template slot="content">
            <p class="category">Solicitações Atendidas</p>
            <h3 class="title">{{ countSolicitacoesAtendidas }}</h3>
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>add_alert</md-icon>
          </template>

          <template slot="content">
            <p class="category">Solicitações Pendentes</p>
            <h3 class="title">{{ countSolicitacoesPendentes }}</h3>
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card data-background-color="red">
          <template slot="header">
            <md-icon>notification_important</md-icon>
          </template>

          <template slot="content">
            <p class="category">Solicitações Caducadas</p>
            <h3 class="title">{{ countSolicitacoesCaducadas }}</h3>
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>emoji_people</md-icon>
          </template>

          <template slot="content">
            <p class="category">Utilizadores Clientes</p>
            <h3 class="title">{{ countClientes }}</h3>
          </template>

          <template slot="footer">
            <div class="stats"></div>
          </template>
        </stats-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Novos Utilizadores</h4>
            <p class="category">Utilizadores Recentemente Registrados</p>
          </md-card-header>
          <md-card-content>
            <ordered-table :users="getNewUsers" table-header-color="orange"></ordered-table>
          </md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs class="md-success" md-alignment="left">
              <md-tab id="tab-pages" md-label="Seguradoras">
                <nav-tabs-table :items="getSeguradoras" proprierty="seguradora"></nav-tabs-table>
              </md-tab>
              <!-- md-icon="cloud" -->
              <md-tab id="tab-posts" md-label="Modalidades">
                <nav-tabs-table :items="getModalidades" proprierty="modalidade"></nav-tabs-table>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard, ChartCard, NavTabsCard, NavTabsTable, OrderedTable } from '@/components';
import status from './../utils/statusEnum';
export default {
  components: {
    StatsCard,
    // ChartCard,
    NavTabsCard,
    NavTabsTable,
    OrderedTable,
  },
  data() {
    return {};
  },
  computed: {
    getNewUsers() {
      return this.$store.getters['userStore/getClientes'];
    },
    countClientes() {
      return this.$store.getters['userStore/countClientes'];
    },
    getMediadores() {
      return this.$store.getters['userStore/getMediadores'];
    },
    getSeguradoras() {
      return this.$store.getters.getSeguradoras;
    },
    getModalidades() {
      return this.$store.getters.getModalidades;
    },
    countSolicitacoesPendentes() {
      return this.$store.getters['solicitacaoStore/countSolicitacoesPendentes'];
    },
    countSolicitacoesAtendidas() {
      return this.$store.getters['solicitacaoStore/countSolicitacoesAtendidas'];
    },
    countSolicitacoesCaducadas() {
      return this.$store.getters['solicitacaoStore/countSolicitacoesCaducadas'];
    },
  },
};
</script>
