<template>
  <div>
    <md-table v-model="searched" md-sort-order="asc" :table-header-color="tableHeaderColor">
      <md-table-toolbar>
        <div class="md-toolbar-section-start"></div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Pesquisar por Seguros..." v-model="search" @input="searchOnTable" />
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
        <md-table-cell md-label="Seguradora">{{ item.seguro.seguradora.seguradora }}</md-table-cell>
        <md-table-cell md-label="Cliente">{{ item.cliente.name }}</md-table-cell>
        <md-table-cell md-label="Tipo">{{ item.cliente.role.perfil }}</md-table-cell>
        <md-table-cell md-label="Prêmio">{{ item.price }}</md-table-cell>
        <md-table-cell md-label="Data Solicitada">{{ getData(item.seguro.createdAt) }}</md-table-cell>
        <md-table-cell md-label="Caducidade">{{ getData(item.validAt) }}</md-table-cell>
        <md-table-cell md-label="Docs">Ver Docs</md-table-cell>
        <md-table-cell md-label="Estado">{{ item.estado.estado }}</md-table-cell>
        <md-table-cell md-label="Opções">
          <md-button class="md-just-icon md-simple md-primary">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
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

export default {
  name: 'solicitacao-table',
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
    };
  },
  methods: {
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
      this.searched = this.solicitacoes;
    },
  },
  mounted() {
    this.fecthUsers();
  },
};
</script>
<style lang="scss" scoped>
.md-field {
  max-width: 300px;
}
</style>
