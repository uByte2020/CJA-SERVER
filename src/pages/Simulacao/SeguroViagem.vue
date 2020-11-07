<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent>
      <div class="md-layout md-gutter">
        <div
          class="md-layout-item md-small-size-100 md-size-50"
          :class="getValidationClass('dataPartida')"
        >
          <label for="data-partida" style="margin-bottom: 0!important;">Data de Partida</label>
          <md-datepicker
            name="data-partida"
            id="data-partida"
            v-model="seguroViagem.dataPartida"
            md-immediately
            :md-disabled-dates="disabledDatePartida"
          />
          <span class="md-error" v-if="!$v.seguroViagem.dataPartida.required">Campo Obrigatório!</span>
        </div>

        <div
          class="md-layout-item md-small-size-100 md-size-50"
          :class="getValidationClass('dataVolta')"
        >
          <label for="data-volta" style="margin-bottom: 0!important;">Data de Volta</label>
          <md-datepicker
            name="data-volta"
            id="data-volta"
            v-model="seguroViagem.dataVolta"
            md-immediately
            :md-disabled-dates="disabledDateVolta()"
          />
          <span class="md-error" v-if="!$v.seguroViagem.dataVolta.required">Campo Obrigatório!</span>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="getValidationClass('plano')">
            <label for="plano">Plano</label>
            <md-select
              name="plano"
              id="plano"
              v-model="seguroViagem.plano"
              md-dense
              :disabled="sending"
            >
              <md-option v-for="plano in getPlanos" :key="plano" :value="plano">{{ plano }}</md-option>
            </md-select>
            <span class="md-error">Campo Obrigatório!</span>
          </md-field>
        </div>

        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field :class="getValidationClass('pessoas')">
            <label for="pessoas">Pessoas</label>
            <md-input
              type="number"
              id="pessoas"
              name="pessoas"
              autocomplete="pessoas"
              v-model="seguroViagem.pessoas"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.seguroViagem.pessoas.required">Campo Obrigatório!</span>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-33">
          <md-field>
            <label for="documentos">BI ou Passaport</label>
            <md-file
              v-model="documentos"
              name="documentos"
              id="documentos"
              :disabled="sending"
              multiple
              @change="setDocs"
            />
          </md-field>
        </div>
      </div>

      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
    <md-button
      @click="validateSeguroViagem"
      class="md-raised md-success"
      :disabled="sending"
    >Continuar</md-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

export default {
  name: 'seguro-viagem',
  mixins: [validationMixin],
  props: {
    seguradora: Object,
    modalidade: Object,
  },
  data() {
    let dateFormat = this.$material.locale.dateFormat || 'yyyy-MM-dd';
    let now = new Date();
    return {
      seguroViagem: {
        plano: null,
        pessoas: 1,
        dataPartida: format(now, dateFormat),
        dataVolta: null,
      },
      documentos: null,
      docsIdentificacaos: null,
      userSaved: false,
      sending: false,
    };
  },
  validations: {
    seguroViagem: {
      plano: {
        required,
      },
      pessoas: {
        required,
      },
      dataPartida: {
        required,
      },
      dataVolta: {
        required,
      },
    },
  },
  methods: {
    setDocs() {
      this.docsIdentificacaos = this.documentos.target.files[0];
    },
    disabledDatePartida: (date) => {
      const dt = Date.now();
      return dt >= date;
    },
    disabledDateVolta() {
      const dataPartida = this.seguroViagem.dataPartida;
      return (date) => {
        const dt = new Date(dataPartida);
        return dt >= date; //>= date;
      };
    },
    getValidationClass(fieldName) {
      const field = this.$v.seguroViagem[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
    },
    saveSeguroViagem() {
      this.sending = true;
      this.seguroViagem.seguradora = this.seguradora.codigoSeguradora;
      this.seguroViagem.modalidade = this.modalidade.modalidade;
      (async () => {
        try {
          await this.$store.dispatch('seguroViagemStore/simularSeguroViagem', this.seguroViagem);
          this.$emit('is-valid', {
            id: 'second',
            index: 'third',
            seguroViagem: this.seguroViagem,
            documentos: this.docsIdentificacaos,
          });
          this.sending = false;
        } catch (err) {
          this.sending = false;
          this.notifyVue(status.WARNING, err.message);
        }
      })();
    },
    validateSeguroViagem() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveSeguroViagem();
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
  computed: {
    getPlanos() {
      return this.$store.getters.getPlanos;
    },
  },
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
