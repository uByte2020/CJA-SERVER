<template>
  <div class="content">
    <SolicitacaoDetalheFiles
      @hide-dialog="hideDialog()"
      :files="files"
      :name="nameFile"
      :show-dialog="showDialog"
    ></SolicitacaoDetalheFiles>
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Detalhes da Solicitação</h4>
            <p class="category">{{ solicitacao.cliente.role.perfil }} - {{ solicitacao.estado.estado }}</p>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label for="solicitante">Solicitante</label>
                  <md-input
                    v-model="solicitacao.cliente.name"
                    type="text"
                    id="solicitante"
                    name="solicitante"
                    disabled
                  />
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label for="mediador">Gestor de Cliente</label>
                  <md-input type="text" id="mediador" name="mediador" disabled />
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label for="seguradora">Seguradora</label>
                  <md-input
                    v-model="solicitacao.seguro.seguradora.seguradora"
                    type="text"
                    id="seguradora"
                    name="seguradora"
                    disabled
                  />
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label for="seguro">Seguro</label>
                  <md-input
                    v-model="solicitacao.seguro.modalidade.modalidade"
                    type="text"
                    id="seguro"
                    name="seguro"
                    disabled
                  />
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label for="preco">Prêmio (AKZ)</label>
                  <md-input v-model="solicitacao.seguro.price" type="text" id="preco" name="preco" disabled />
                </md-field>
              </div>
            </div>
            <SolicitacaoViagemDetalhe
              v-if="solicitacao.seguro.modalidade.modalidade === modalidades.VIAGEM"
              v-show="hasPermission(solicitacao.cliente.role.perfilCode, 0, 1, 2)"
              :seguro-viagem="solicitacao.seguro.seguroViagem"
            ></SolicitacaoViagemDetalhe>
            <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field v-show="!hasFiles(solicitacao.seguro.docIdentificacaos)">
                  <label for="docsIdentificacao">Anexar Documentos de Identificação</label>
                  <md-file
                    v-model="docIdentificacaos"
                    @change="setDocIdentificacaos"
                    name="docsIdentificacao"
                    id="docsIdentificacao"
                    multiple
                    :disabled="restrictTo(0, 1)"
                  />
                </md-field>

                <md-button
                  v-show="hasFiles(solicitacao.seguro.docIdentificacaos)"
                  class="md-raised md-success"
                  @click="
                    callDialog(
                      solicitacao.seguro.docIdentificacaos,
                      'Docs de Identificação',
                      getFileURL(docsType.DOCIDENTICICACAO),
                    )
                  "
                  >Ver Docs de Identificação</md-button
                >
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field v-show="!hasFiles(solicitacao.seguro.comprovativos)">
                  <label for="comprovativo">Anexar Comprovativo</label>
                  <md-file
                    v-model="comprovativos"
                    @change="setComprovativos"
                    name="comprovativo"
                    id="comprovativo"
                    multiple
                    :disabled="!restrictTo(2, 3)"
                  />
                </md-field>

                <md-button
                  v-show="hasFiles(solicitacao.seguro.comprovativos)"
                  class="md-raised md-success"
                  @click="
                    callDialog(solicitacao.seguro.comprovativos, 'Comprovativos', getFileURL(docsType.COMPROVATIVO))
                  "
                  >Ver Comprovativos</md-button
                >
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field v-show="!solicitacao.seguro.apolice && restrictTo(0, 1)">
                  <label for="apolice">Anexar Apólice</label>
                  <md-file v-model="apolice" @change="setApolice" name="apolice" id="apolice" multiple />
                </md-field>

                <md-button
                  v-show="solicitacao.seguro.apolice"
                  class="md-raised md-success"
                  @click="callDialog(solicitacao.seguro.apolice, 'Apólice de Seguro', getFileURL(docsType.APOLICE))"
                  >Ver Aplice de Seguro</md-button
                >
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field v-show="!solicitacao.seguro.simulacao && restrictTo(0, 1)">
                  <label for="simulacao">Anexar Simulacao</label>
                  <md-file v-model="simulacao" @change="setSimulacao" name="simulacao" id="simulacao" />
                </md-field>

                <md-button
                  v-show="solicitacao.seguro.simulacao"
                  class="md-raised md-success"
                  @click="
                    callDialog(solicitacao.seguro.simulacao, 'Simulação de Seguro', getFileURL(docsType.SIMULACAO))
                  "
                  >Ver Simulacao de Seguro</md-button
                >
              </div>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-raised md-success" @click="update">{{ getBtnValidateText }}</md-button>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SolicitacaoViagemDetalhe, SolicitacaoDetalheFiles } from '@/pages';
import DocsType from './../utils/docsType';
import utilModalidades from './../utils/modalidades';
export default {
  name: 'simulacao-detalhe',
  components: { SolicitacaoViagemDetalhe, SolicitacaoDetalheFiles },
  props: ['solicitacaoId'],
  data() {
    return {
      solicitacao: {
        seguro: {
          price: null,
          simulacao: null,
          apolice: null,
          comprovativos: [],
          docIdentificacaos: [],
          estado: null,
          tipo: null,
          modalidade: {
            modalidade: null,
          },
          seguradora: {
            seguradora: null,
          },
          seguroViagem: {
            pessoas: 1,
            documentos: [],
            createdAt: null,
            plano: null,
            dataPartida: null,
            dataVolta: null,
            seguro: null,
          },
        },
        cliente: {
          name: null,
          role: { perfil: null, perfilCode: null },
        },
        estado: { estado: null, estadoCode: null },
        validAt: null,
      },
      seguro: {
        docIdentificacaos: null,
        comprovativos: null,
        apolice: null,
        simulacao: null,
      },
      docIdentificacaos: null,
      comprovativos: null,
      apolice: null,
      simulacao: null,
      files: [],
      nameFile: '',
      showDialog: false,
      docsType: DocsType,
      modalidades: utilModalidades,
    };
  },
  mounted() {
    this.getSolicitacaoById();
  },
  methods: {
    hasFiles(file) {
      if (Array.isArray(file)) return file.length > 0;
      return false;
    },
    callDialog(files, name, url) {
      files = Array.isArray(files) ? files : [files];

      this.files = files.map((el) => {
        return { url: `${url}${el}`, name: el };
      });
      this.nameFile = name;
      this.showDialog = true;
    },
    hideDialog() {
      this.showDialog = false;
    },
    setComprovativos() {
      this.seguro.comprovativos = this.comprovativos.target.files;
    },
    setSimulacao() {
      this.seguro.simulacao = this.simulacao.target.files;
    },
    setDocIdentificacaos() {
      this.seguro.docIdentificacaos = this.docIdentificacaos.target.files;
    },
    setApolice() {
      this.seguro.apolice = this.apolice.target.files;
    },
    async update() {
      const seguro = new FormData();

      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });

      seguro.append('_id', this.solicitacao.seguro._id);

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
      if (this.seguro.simulacao) {
        this.seguro.simulacao.forEach((element) => {
          seguro.append('simulacao', element);
        });
      }
      if (this.seguro.apolice) {
        this.seguro.apolice.forEach((element) => {
          seguro.append('apolice', element);
        });
      }

      try {
        const seguroResponse = await this.$store.dispatch('seguroStore/updateSeguro', seguro);
        if (seguroResponse.data.doc.apolice) await this.updateSolicitacao({ _id: this.solicitacao._id, estado: 1 });
        await this.fetchSolicitacoes();
        loader.hide();
        this.$router.push('/solicitacoes');
      } catch (err) {
        loader.hide();
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async updateSolicitacao(solicitacao) {
      try {
        await this.$store.dispatch('updateSolicitacao', solicitacao);
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async getSolicitacaoById() {
      try {
        const response = await this.$store.dispatch('solicitacaoStore/getSolicitacoesById', this.solicitacaoId);
        this.solicitacao = response.data.doc;
        this.solicitacao.seguro.seguradora = this.solicitacao.seguro.seguradora || { seguradora: '' };
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
    hasPermission(type, ...allowType) {
      return allowType.includes(type);
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
    getBtnValidateText() {
      return this.restrictTo(0, 1) ? 'Enviar' : 'Actualizar';
    },
    getSolicitacao() {
      return this.$store.getters['userStore/getUsers'];
    },
    getSeguroViagem() {
      return this.solicitacao.seguro.seguroViagem;
    },
    restrictTo() {
      return this.$store.getters['userStore/restrictTo'];
    },
    getFileURL() {
      return this.$store.getters['solicitacaoStore/getFileURL'];
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
