function ListaPalpites({palpite}) {
    return (
        <>
          {palpite?.jogo?.infoJogo} {'-'} {palpite?.jogo?.infoCamp}
            <div className='times'>
              <div className='time1'>
                <img 
                      src={palpite?.jogo?.isocodetime1} 
                      alt='Escudo Time 1' 
                      style={{
                          width: '2em',
                          height: '2em'
                  }}>
                </img>
                <h2>{palpite?.jogo?.time1}</h2>
                <h2>{palpite?.palpite1}</h2>
              </div>
              <h2>x</h2>
              <div className='time2'>
                <h2>{palpite?.palpite2}</h2>
                <h2>{palpite?.jogo?.time2}</h2>
                <img 
                    src={palpite?.jogo?.isocodetime2} 
                    alt='Escudo Time 2' 
                    style={{
                        width: '2em',
                        height: '2em'
                }}>
                </img>
                <>
                  {palpite?.jogo?.gameType === 1 && palpite?.pontuacao === 5 && <h2 className='palpiteG'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 1 && palpite?.pontuacao === 4 && <h2 className='palpiteB'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 1 && palpite?.pontuacao === 3 && <h2 className='palpiteY'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 1 && palpite?.pontuacao === 1 && <h2 className='palpiteC'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 2 && palpite?.pontuacao === 10 && <h2 className='palpiteG'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 2 && palpite?.pontuacao === 8 && <h2 className='palpiteB'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 2 && palpite?.pontuacao === 6 && <h2 className='palpiteY'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.gameType === 2 && palpite?.pontuacao === 2 && <h2 className='palpiteC'>+{palpite?.pontuacao}</h2>}
                  {palpite?.jogo?.placar1 !== "" && palpite?.jogo?.placar2 !== "" && palpite?.pontuacao === 0 && <h2 className='palpiteR'>+{palpite?.pontuacao}</h2>}
                          
                </>
              </div>
            </div>
        </>
    )
}

export default ListaPalpites