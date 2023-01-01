import "./ListaSuspensa.css"
const ListaSuspensa = ({label, itens, valor, aoAlterado, required = false}) => {
    
    return (
        <div className="lista-suspensa">
            <label>{label}</label>
            <select required={required} value={valor} onChange={evento => aoAlterado(evento.target.value)} >
                <option />
                {itens.map(item => {
                    return <option key={item}>{item}</option>
                })}    
            </select>
        </div>
    )
}

export default ListaSuspensa