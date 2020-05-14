const Planos = require('./planos');

const SEGURADORA = {
  NOSSA_SEGURO: 'NOSSASEGURO'
};

class SimulacaoViagem {
  constructor(filds, seguradora) {
    this.filds = filds;
    this.seguradora = seguradora;
  }

  simular() {
    if (SEGURADORA.NOSSA_SEGURO === this.seguradora) {
      const { plano, pessoas, dataPartida, dataVolta } = this.filds;

      const Plano = Planos.getPlanos()[plano.toLowerCase()];

      if (!Plano) return false;

      const difference = Math.abs(
        new Date(dataPartida).getTime() - new Date(dataVolta).getTime()
      );
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      let index;

      if (days >= 1 && days <= 8) {
        index = 0;
      } else if (days >= 9 && days <= 10) {
        index = 1;
      } else if (days >= 11 && days <= 15) {
        index = 2;
      } else if (days >= 16 && days <= 21) {
        index = 3;
      } else if (days >= 22 && days <= 30) {
        index = 4;
      } else if (days >= 31 && days <= 60) {
        index = 5;
      } else if (days >= 61 && days <= 90) {
        index = 6;
      } else {
        index = null;
      }

      if (!index) return false;

      const keys = Object.keys(Plano);
      const precos = [];
      if (!keys)
        keys.forEach(key => {
          const preco = (Plano[key][index] * pessoas).toFixed(2);
          precos.push({ key, preco });
        });
      else precos.push((Plano[index] * pessoas).toFixed(2));
      return precos;
    }
    return false;
  }
}

module.exports = SimulacaoViagem;
