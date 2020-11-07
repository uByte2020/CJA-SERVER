<template>
  <div>
    <md-table v-model="items" @md-selected="onSelect">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell>{{ item[proprierty] }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: 'nav-tabs-table',
  props: {
    items: Array,
    proprierty: String,
  },
  data() {
    return {
      selected: [],
      data: [],
    };
  },
  methods: {
    onSelect: function(items) {
      this.selected = items;
    },
  },
};
</script>
