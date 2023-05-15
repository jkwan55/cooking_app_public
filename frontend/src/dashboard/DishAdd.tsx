import '@/dashboard/Dashboard.css';
import React, { useState } from 'react';

type ModalFunction = () => void;

type Props = {
    closeModal: ModalFunction,
    addDish: Function
};

const DishAdd = ({ closeModal, addDish }: Props) => {
    const closeModalFunc = closeModal;
    const [message, setMessage] = useState<string>('');

    const handleAddDish = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            if (message){
                addDish({variables: {name: message}});
            }
            setMessage('');
            closeModalFunc();
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    

    return (
        <div className='modal addModal'>
            <div className='poptop'><b>Add a new Dish</b></div>
            <a className="close" onClick={closeModalFunc}>
                &times;
            </a>
            <div className='popsearch-area'>
                <input placeholder='Dish name' className='popsearch'
                    onKeyDown={(e) => handleAddDish(e)} onChange={e => handleInputChange(e)}
                    value={message}
                ></input>
            </div>
        </div>
        
    );
}


export default DishAdd;
