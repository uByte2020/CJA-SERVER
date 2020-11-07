<template>
  <div class="md-layout">
    <div class="md-layout-item md-small-size-100 md-size-33">
      <md-field>
        <label for="plano">Plano</label>
        <md-input v-model="seguroViagem.plano" type="text" id="plano" name="plano" disabled />
      </md-field>
    </div>
    <div class="md-layout-item md-small-size-100 md-size-33">
      <md-field>
        <label for="pessoa">Pessoas</label>
        <md-input v-model="seguroViagem.pessoas" type="text" id="pessoa" name="pessoa" disabled />
      </md-field>
    </div>
    <div class="md-layout-item md-small-size-100 md-size-33">
      <md-field>
        <label for="dataPartida">Data de Partida</label>
        <md-input
          :value="getData(seguroViagem.dataPartida)"
          type="text"
          id="dataPartida"
          name="dataPartida"
          disabled
        />
      </md-field>
    </div>
    <div class="md-layout-item md-small-size-100 md-size-30">
      <md-field>
        <label for="dataVolta">Data Volta</label>
        <md-input
          :value="getData(seguroViagem.dataVolta)"
          type="text"
          id="dataVolta"
          name="dataVolta"
          disabled
        />
      </md-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'solicitacao-seguro-viagem',
  props: {
    seguroViagem: {},
  },
  data() {
    return {};
  },
  methods: {
    getData(date) {
      const formatDate = new Date(date);
      return `${formatDate.getFullYear()}-${formatDate.getMonth() + 1}-${formatDate.getDate()}`;
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
