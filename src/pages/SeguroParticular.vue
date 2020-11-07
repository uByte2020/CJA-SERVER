<template>
  <div class="content">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Solicitação de Seguro</h4>
            <p class="category"></p>
          </md-card-header>

          <md-card-content>
            <seguro-viagem-preco
              :simulacaoViagem="getSimulacaoViagem"
              :showDialog="showDialog"
              @set-preco="setPreco"
            ></seguro-viagem-preco>
            <div class="md-layout">
              <div class="md-layout-item md-medium-size-100 md-size-90">
                <div id="sv-stepers">
                  <md-steppers :md-active-step.sync="active" md-linear>
                    <md-step
                      id="first"
                      md-label="Seguradora e Modalidade"
                      md-description="Obrigatório"
                      :md-done.sync="first"
                      class="md-success"
                    >
                      <seguradora-modalidade
                        :seguradoras="getSeguradoras"
                        @is-valid="setSeguradoraModalidade"
                        @error="setError"
                      ></seguradora-modalidade>
                    </md-step>

                    <md-step id="second" md-label="Simulação" :md-error="secondStepError" :md-done.sync="second">
                      <seguro-viagem
                        v-show="seguro.modalidade.isAutomatic"
                        :seguradora="seguro.seguradora"
                        :modalidade="seguro.modalidade"
                        @error="setError()"
                        @is-valid="showModal"
                      ></seguro-viagem>

                      <SerguroGeral v-show="!seguro.modalidade.isAutomatic" @is-valid="getResultFromComponent" />
                    </md-step>

                    <md-step id="third" md-label="Resultado" :md-done.sync="third">
                      <simulacao-result :seguro="seguro" @update-comprovativo="setComprovativos"></simulacao-result>
                      <md-button class="md-raised md-success" @click="solicitarSeguro()">Solicitar</md-button>
                    </md-step>
                  </md-steppers>
                </div>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SeguroViagem, SeguradoraModalidade, SimulacaoResult, SeguroViagemPreco, SerguroGeral } from '@/pages';
import utilModalidades from './../utils/modalidades';
export default {
  components: { SeguroViagem, SeguradoraModalidade, SimulacaoResult, SeguroViagemPreco, SerguroGeral },
  data: () => ({
    showDialog: false,
    active: 'first',
    first: false,
    second: false,
    third: false,
    secondStepError: null,
    seguro: {
      modalidade: {},
      seguradora: {},
      price: null,
      simulacao: null,
      comprovativos: null,
      docIdentificacaos: null,
    },
    lastId: null,
    lastIndex: null,
    seguroViagem: {},
    modalidades: utilModalidades,
  }),
  methods: {
    showModal({ id, index, seguroViagem, documentos }) {
      this.seguroViagem = seguroViagem;
      this.setDocIdentificacaos(documentos);
      this.lastId = id;
      this.lastIndex = index;
      this.showDialog = true;
    },
    setPreco({ preco }) {
      this.showDialog = false;
      this.seguro.price = preco;
      this.setDone({ id: this.lastId, index: this.lastIndex });
    },
    getResultFromComponent({ id, index, documentos }) {
      this.seguro.price = 0.0;
      this.setDocIdentificacaos(documentos);
      this.setDone({ id, index });
    },
    setDocIdentificacaos(docIdentificacaos) {
      this.seguro.docIdentificacaos = docIdentificacaos;
    },
    setDone({ id, index }) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },

    setError({ message }) {
      this.secondStepError = message;
    },
    setSeguradoraModalidade({ id, index, seguradora, modalidade }) {
      this.seguro.modalidade = modalidade;
      this.seguro.seguradora = seguradora;
      this.setDone({ id: id, index: index });
    },
    setComprovativos({ comprovativos }) {
      this.seguro.comprovativos = comprovativos;
    },
    async solicitarSeguro() {
      const seguro = new FormData();
      const solicitacao = {};

      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });

      seguro.append('tipo', this.getUser.role.perfil);
      seguro.append('modalidade', this.seguro.modalidade._id);
      seguro.append('seguradora', this.seguro.seguradora._id);
      seguro.append('price', this.seguro.price);

      if (this.seguro.comprovativos !== null) seguro.append('comprovativos', this.seguro.comprovativos);
      if (this.seguro.docIdentificacaos) seguro.append('docIdentificacaos', this.seguro.docIdentificacaos);

      try {
        let validAt = null;
        const seguroResponse = await this.$store.dispatch('seguroStore/solicitarSeguro', seguro);
        if (this.seguro.modalidade.modalidade === this.modalidades.VIAGEM) {
          validAt = this.seguroViagem.dataVolta;
          await this.solicitarSeguroViagem(seguroResponse.data.doc._id);
        }

        await this.solicitar({
          seguro: seguroResponse.data.doc._id,
          cliente: this.getUser._id,
          validAt: validAt,
        });
        await this.fetchSolicitacoes();
        loader.hide();
        this.$router.push('solicitacoes');
      } catch (err) {
        loader.hide();
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async solicitarSeguroViagem(seguroId) {
      try {
        this.seguroViagem.seguro = seguroId;
        const viagemResponse = await this.$store.dispatch('seguroViagemStore/solicitarSeguroViagem', this.seguroViagem);
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async solicitar(solicitacao) {
      try {
        const solResponse = await this.$store.dispatch('solicitar', solicitacao);
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
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
  computed: {
    getSeguradoras() {
      return this.$store.getters.getSeguradoras;
    },
    getSimulacaoViagem() {
      return this.$store.getters['seguroViagemStore/getSimulacaoViagem'];
    },
    getUser() {
      return this.$store.getters['userStore/getUser'];
    },
  },
};
</script>
<style lang="scss" scoped></style>
