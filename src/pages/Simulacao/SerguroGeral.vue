<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100 md-size-50">
        <md-field>
          <label for="docsIdentificacao">Anexar Documentos*</label>
          <md-file
            name="docsIdentificacao"
            id="docsIdentificacao"
            v-model="docIdentificacaosTemp"
            @change="setDocIdentificacaos"
            multiple
          />
        </md-field>
      </div>
    </div>
    <md-button @click="next" class="md-raised md-success" :disabled="sending">Continuar</md-button>
  </div>
</template>

<script>
export default {
  name: 'SerguroGeral',
  props: {
    title: {
      default: 'Solicitação de Seguro',
      type: String,
    },
  },
  components: {},
  data: () => ({
    docIdentificacaosTemp: null,
    docIdentificacaos: null,
    sending: true,
  }),
  methods: {
    setDocIdentificacaos() {
      this.docIdentificacaos = this.docIdentificacaosTemp.target.files[0];
      this.sending = false;
    },
    next() {
      this.$emit('is-valid', {
        id: 'second',
        index: 'third',
        documentos: this.docIdentificacaos,
      });
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
  computed: {
    getUser() {
      return this.$store.getters['userStore/getUser'];
    },
  },
};
</script>
<style lang="scss" scoped></style>
