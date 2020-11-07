<template>
  <div>
    <md-table v-model="searched" md-sort-order="asc" :table-header-color="tableHeaderColor">
      <md-table-toolbar>
        <div class="md-toolbar-section-start"></div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Pesquisar por Seguro..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="Nenhum Solicitação Encontrada"
        :md-description="`Nenhum utilizador com o nome '${search}' encontrado. Tenta pesquisar com um nome diferente.`"
      >
        <!-- <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button> -->
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Seguro">{{ item.seguro.modalidade.modalidade }}</md-table-cell>
        <md-table-cell md-label="Seguradora">{{ getSeguradora(item.seguro.seguradora) }}</md-table-cell>
        <md-table-cell md-label="Cliente">{{ item.cliente.name }}</md-table-cell>
        <md-table-cell md-label="Tipo">{{ item.cliente.role.perfil }}</md-table-cell>
        <md-table-cell md-label="Prêmio (AKZ)">{{ item.seguro.price === 0 ? ' - ' : item.seguro.price }}</md-table-cell>
        <md-table-cell md-label="Data Solicitada">{{ getData(item.seguro.createdAt) }}</md-table-cell>
        <md-table-cell md-label="Caducidade">{{ item.validAt ? getData(item.validAt) : ' - ' }}</md-table-cell>
        <!-- <md-table-cell md-label="Docs">Ver Docs</md-table-cell> -->
        <md-table-cell md-label="Estado" :class="getTextClassColor(item.estado.estadoCode)">{{
          item.estado.estado
        }}</md-table-cell>
        <md-table-cell md-label="Detalhes">
          <md-button @click="callSeguroDetalhe(item)" class="md-just-icon md-simple md-success">
            <md-icon>visibility</md-icon>
            <md-tooltip md-direction="top">Ver Detalhes</md-tooltip>
          </md-button>
          <md-button
            @click="deleteSeguroDetalhe(item)"
            v-show="item.estado.estadoCode == 2"
            class="md-just-icon md-simple md-success"
          >
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Cancelar</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <Pagination
      :total="solicitacoes.length"
      :perPage="limit"
      @input="changePage"
      type="success"
      :value="page"
    ></Pagination>
  </div>
</template>

<script>
const toLower = (text) => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.seguro.modalidade.modalidade).includes(toLower(term)));
  }
  return items;
};

import { Pagination } from '@/components';

export default {
  name: 'solicitacao-table',
  components: {
    Pagination,
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: '',
    },
    solicitacoes: Array,
  },
  data() {
    return {
      selected: [],
      search: null,
      searched: [],
      textColors: {
        activo: 'activo',
        pendente: 'pendente',
        renovado: 'renovado',
        caducado: 'caducado',
        cancelado: 'cancelado',
        desativado: 'desativado',
      },
      limit: 5,
      page: 1,
    };
  },
  methods: {
    changePage(page) {
      this.page = page;
      const skip = (page - 1) * this.limit;
      this.searched = this.solicitacoes.slice(skip, skip + this.limit);
    },
    getSeguradora(seguradora) {
      return seguradora ? seguradora.seguradora : '-';
    },
    getData(date) {
      const formatDate = new Date(date);
      return `${formatDate.getFullYear()}-${formatDate.getMonth() + 1}-${formatDate.getDate()}`;
    },
    newUser() {
      window.alert('Noop');
    },
    searchOnTable() {
      this.searched = searchByName(this.solicitacoes, this.search);
    },
    changeBloqState(item) {
      item.isBloqued = !item.isBloqued;
    },
    fecthUsers() {
      this.changePage(1);
    },
    callSeguroDetalhe(solicitacao) {
      this.$store.dispatch('solicitacaoStore/setSolicitacao', solicitacao);
      this.$router.push({ name: 'solicitacoes-detalhe', params: { solicitacaoId: solicitacao._id } });
    },
    async deleteSeguroDetalhe(solicitacao) {
      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });
      try {
        await this.$store.dispatch('solicitacaoStore/cancelarSolicitacao', { _id: solicitacao._id, estado: 5 });
        await this.fetchSolicitacoes();
        loader.hide();
        this.$router.push('/solicitacoes');
      } catch (err) {
        loader.hide();
        this.notifyVue(status.DANGER, err.message);
      }
    },
    getTextClassColor(estado) {
      switch (estado) {
        case 1:
          return this.textColors.activo;
        case 2:
          return this.textColors.pendente;
        case 3:
          return this.textColors.renovado;
        case 4:
          return this.textColors.caducado;
        case 5:
          return this.textColors.cancelado;
        case 6:
          return this.textColors.desativado;
      }
    },
    async fetchSolicitacoes() {
      try {
        await this.$store.dispatch('solicitacaoStore/getSolicitacoes');
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    notifyVue(status, message) {
      this.$notify({
        message: message,
        icon: 'add_alert',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: status,
      });
    },
  },
  created() {
    this.fecthUsers();
  },
};
</script>
<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
