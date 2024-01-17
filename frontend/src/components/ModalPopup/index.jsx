import React from 'react';
import Popup from 'reactjs-popup';
import './ModalPopup.css'

function ModalPopup(props) {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn' onClick={() => props.setTrigger(false)}>X</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default ModalPopup