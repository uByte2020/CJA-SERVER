const Planos = require('./planos');
const AppError = require('./../appError');

const SEGURADORA = {
  NOSSA_SEGURO: 'TESTE' //TODO:
};

class SimulacaoViagem {
  constructor(filds, seguradora) {
    this.filds = filds;
    this.seguradora = seguradora;
  }

  simular() {
    if (SEGURADORA.NOSSA_SEGURO === this.seguradora) {
      const { plano, pessoas, dataPartida, dataVolta } = this.filds;

      const Plano = Planos[plano.toLowerCase()];

      if (!Plano)
        return {
          status: false,
          err: new AppError('Plano Não Válido', 500)
        };

      const difference =
        new Date(dataVolta).getTime() - new Date(dataPartida).getTime();
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

      if (index === null)
        return {
          status: false,
          err: new AppError('Periodo de Viagem Inválido', 500)
        };

      const keys = Object.keys(Plano);
      const precos = [];
      keys.forEach(key => {
        const preco = {};
        preco[key] = (Plano[key][index] * pessoas).toFixed(2);
        precos.push(preco);
      });

      return {
        status: true,
        data: precos
      };
    }
    return {
      status: false,
      err: new AppError(
        'Não é possivel efectuar a simulação para esta seguradora',
        500
      )
    };
  }
}

module.exports = SimulacaoViagem;
