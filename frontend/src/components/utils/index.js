export function ordenarRanking( a, b ) {
        
    if ( a.pontuacao < b.pontuacao ) {
      return -1;
    }
  
    if ( a.pontuacao > b.pontuacao ) {
      return 1;
    }
  
    return 0;
}