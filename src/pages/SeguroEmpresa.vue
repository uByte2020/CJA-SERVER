<template>
  <div class="content">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Solicitação de Seguros Empresarial</h4>
            <p class="category"></p>
          </md-card-header>

          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                  <label for="modalidade">Modalidades*</label>
                  <md-select v-model="modalidadeId" @md-selected="setModalidade()" name="modalidade" id="modalidade">
                    <md-option v-for="modalidade in getModalidades" :key="modalidade._id" :value="modalidade._id">
                      {{ modalidade.modalidade }}
                    </md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                  <label for="docsIdentificacao">Anexar Documentos*</label>
                  <md-file
                    name="docsIdentificacao"
                    id="docsIdentificacao"
                    v-model="docIdentificacaos"
                    @change="setDocIdentificacaos"
                    multiple
                  />
                </md-field>
              </div>
              <md-button class="md-raised md-success" @click="solicitarSeguro()">Continue</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    movie: 'godfather',
    country: null,
    font: null,
    modalidadeId: null,
    seguradoraId: null,
    modalidades: [],
    seguro: {
      modalidade: null,
      seguradora: null,
      comprovativos: null,
      docIdentificacaos: null,
    },
    isModalidadeAvailable: true,
    docIdentificacaos: null,
    comprovativos: null,
  }),
  methods: {
    setSeguradora() {
      this.modalidadeId = '';
      this.seguro.seguradora = this.getSeguradoras.find((seg) => seg._id === this.seguradoraId);
      this.modalidades = this.seguro.seguradora.modalidades.filter((mod) => mod.isActive);
      if (this.modalidades.length > 0) this.isModalidadeAvailable = false;
    },
    setModalidade() {
      this.seguro.modalidade = this.getModalidades.find((mod) => mod._id === this.modalidadeId);
    },
    setComprovativos() {
      this.seguro.comprovativos = this.comprovativos.target.files;
    },
    setDocIdentificacaos() {
      this.seguro.docIdentificacaos = this.docIdentificacaos.target.files;
    },
    async solicitarSeguro() {
      const seguro = new FormData();
      const solicitacao = {};

      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });

      if (this.seguro.comprovativos) {
        this.seguro.comprovativos.forEach((element) => {
          seguro.append('comprovativos', element);
        });
      }
      if (this.seguro.docIdentificacaos) {
        this.seguro.docIdentificacaos.forEach((element) => {
          seguro.append('docIdentificacaos', element);
        });
      }

      seguro.append('tipo', this.getUser.role.perfil);
      seguro.append('modalidade', this.seguro.modalidade._id);
      // seguro.append('seguradora', this.seguro.seguradora._id);

      try {
        const seguroResponse = await this.$store.dispatch('seguroStore/solicitarSeguro', seguro);
        // await this.solicitarSeguroViagem(seguroResponse.data.doc._id);
        await this.solicitar({ seguro: seguroResponse.data.doc._id, cliente: this.getUser._id });
        this.fetchSolicitacoes();
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
    getModalidades() {
      return this.$store.getters.getModalidades; //this.modalidades;
    },
    getSeguradoras() {
      return this.$store.getters.getSeguradoras.filter((seg) => seg.isActive);
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
