<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="seguradora">Seguradoras</label>
          <md-select
            v-model="seguradoraId"
            @md-selected="setSeguradora()"
            name="seguradora"
            id="seguradora"
          >
            <md-option
              v-for="seguradora in getSeguradoras"
              :key="seguradora._id"
              :value="seguradora._id"
            >{{ seguradora.seguradora }}</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item">
        <md-field>
          <label for="modalidade">Modalidades</label>
          <md-select
            v-model="modalidadeId"
            @md-selected="setModalidade()"
            name="modalidade"
            id="modalidade"
            :disabled="isModalidadeAvailable"
          >
            <md-option
              v-for="modalidade in modalidades"
              :key="modalidade._id"
              :value="modalidade._id"
            >{{ modalidade.modalidade }}</md-option>
          </md-select>
        </md-field>
      </div>
    </div>
    <md-button class="md-raised md-success" @click="setDone()">Continue</md-button>
  </div>
</template>

<script>
export default {
  name: 'seguradora-modalidade',
  props: {
    seguradoras: Array,
  },
  mounted() {},
  data: () => ({
    movie: 'godfather',
    country: null,
    font: null,
    modalidadeId: null,
    seguradoraId: null,
    modalidades: [],
    modalidade: null,
    seguradora: null,
    isModalidadeAvailable: true,
  }),
  methods: {
    setSeguradora() {
      this.modalidadeId = '';
      this.seguradora = this.seguradoras.find((seg) => seg._id === this.seguradoraId);
      this.modalidades = this.seguradora.modalidades.filter((mod) => mod.isActive);
      if (this.modalidades.length > 0) this.isModalidadeAvailable = false;
    },
    setModalidade() {
      this.modalidade = this.modalidades.find((mod) => mod._id === this.modalidadeId);
    },
    setDone() {
      if (this.seguradora && this.modalidade)
        this.$emit('is-valid', {
          id: 'first',
          index: 'second',
          seguradora: this.seguradora,
          modalidade: this.modalidade,
        });
      else this.$emit('error', { message: 'Campos não preenchidos' });
    },
  },
  computed: {
    getModalidades() {
      return this.modalidades;
    },
    getSeguradoras() {
      return this.seguradoras.filter((seg) => seg.isActive);
    },
  },
};
</script>
