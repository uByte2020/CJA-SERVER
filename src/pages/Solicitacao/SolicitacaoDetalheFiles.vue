<template>
  <div class="content">
    <div class="md-layout">
      <md-dialog :md-active.sync="show">
        <md-dialog-title>{{ name }}</md-dialog-title>
        <div>
          <md-table v-model="files">
            <md-table-row slot="md-table-row" @click="downloadItem(item)" slot-scope="{ item }" md-auto-select>
              <md-table-cell md-label="Ficheiro">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Opção">Download</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
        <md-dialog-actions>
          <md-button class="md-raised md-success" @click="hideDialog">Fechar</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'seguro-files',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    files: Array,
    name: String,
  },
  data: () => ({
    selected: null,
  }),
  methods: {
    downloadItem({ url, name }) {
      axios
        .get(url, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: response.data.type });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = name;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
    hideDialog() {
      this.$emit('hide-dialog');
    },
  },
  computed: {
    show() {
      return this.showDialog;
    },
  },
};
</script>

<style lang="scss" scoped>
.md-dialog .md-dialog-container {
  max-width: 768px;
}
</style>
