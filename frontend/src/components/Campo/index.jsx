import './Campo.css'

const Campo = ({ type = 'text', label, placeholder, valor, aoAlterado, required = false }) => {
    return (
        <div className={`campo campo-${type}`}>
            <label>
                {label}
            </label>
            <input type={type} value={valor} onChange={evento => aoAlterado(evento.target.value)} required={required} placeholder={placeholder}/>
        </div>
    )
}

export default Campo