export function ordenarRanking( a, b ) {
        
    if ( a.pontuacao < b.pontuacao ) {
      return -1;
    }
  
    else if ( a.pontuacao > b.pontuacao ) {
      return 1;
    }

    else if ( a.pontuacao == b.pontuacao ) {
      if( a.palpitesCravados < b.palpitesCravados) {
        return -1;
      }

      if (a.palpitesCravados > b.palpitesCravados) {
        return 1;
      }
    }
  
    return 0;
}

export function ordenarJogos(a, b) {
  if( a.jogo._id < b.jogo._id) {
    return -1;
  }

  if (a.jogo._id > b.jogo._id) {
    return 1;
  }

  return 0;
}