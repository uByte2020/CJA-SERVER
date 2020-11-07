<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label for="seguradora">Seguradora</label>
          <md-input v-model="seguro.seguradora.seguradora" type="text" id="seguradora" name="seguradora" disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label for="seguro">Seguro</label>
          <md-input v-model="seguro.modalidade.modalidade" type="text" id="seguro" name="seguro" disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label for="preco">Prêmio (AKZ)</label>
          <md-input v-model="seguro.price" type="text" id="preco" name="preco" disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-50">
        <md-field>
          <label for="iban">Iban</label>
          <md-input v-model="seguro.seguradora.ibans" type="text" id="iban" name="iban" disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-100 md-size-33">
        <md-field>
          <label for="comprovativo">Anexar Comprovativo</label>
          <md-file v-model="comprovativos" name="comprovativo" id="comprovativo" @change="setComprovativo" multiple />
        </md-field>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'simulacao-result',
  props: {
    seguro: Object,
    iban: null,
  },
  data() {
    return {
      comprovativos: null,
    };
  },
  methods: {
    setComprovativo() {
      this.$emit('update-comprovativo', { comprovativos: this.comprovativos.target.files[0] });
    },
  },
};
</script>

<style lang="scss" scoped>
.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(#000, 0.12);
}
</style>
