import "./ListaSuspensaImg.css"
const ListaSuspensaImg = ({label, itens, valor, aoAlterado, required = false}) => {
    
    return (
        <div className="lista-suspensa">
            <label>{label}</label>
            <select required={required} value={valor} onChange={evento => aoAlterado(evento.target.value)} >
                <option />
                {itens.map(item => {
                    return <option key={item.text} label={item.text}>{item.img}</option>
                })}    
            </select>
        </div>
    )
}

export default ListaSuspensaImg