<template>
  <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nome">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Perfil">{{ item.role.perfil }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: 'ordered-table',
  props: {
    tableHeaderColor: {
      type: String,
      default: '',
    },
    users: Array,
  },
  data() {
    return {
      selected: [],
    };
  },
};
</script>
