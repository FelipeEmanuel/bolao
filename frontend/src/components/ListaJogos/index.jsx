import {useState} from 'react'
import { useEffect } from 'react'
import ReactCountryFlag from 'react-country-flag'
import './ListaJogos.css'
import {MdOutlineDelete, MdEdit} from 'react-icons/md'

function ListaJogos({jogo}) {
    return (
        <div className='jogos'>
                <div>
                    <h3>{jogo.infoGroup}</h3>
                    {jogo.infoJogo}
                </div>
                    <div className='times'>
                        <div className='time1'>
                            <ReactCountryFlag countryCode={jogo.isocodetime1} svg style={{
                                width: '2em',
                                height: '2em',
                            }}/>
                            <h2>{jogo.time1}</h2>
                        </div>
                            <h2 className='h2test'>{jogo.placar1} x {jogo.placar2}</h2>
                        <div className='time2'>
                            <h2>{jogo.time2}</h2>
                            <ReactCountryFlag countryCode={jogo.isocodetime2} svg style={{
                                width: '2em',
                                height: '2em',
                            }}/>
                        </div>
                        <MdEdit className='editar'/>
                        <MdOutlineDelete className='deletar'/>
                    </div>
        </div>
    )
}

export default ListaJogos