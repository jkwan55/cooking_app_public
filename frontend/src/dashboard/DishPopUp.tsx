import '@/dashboard/Dashboard.css';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Switch from '@mui/material/Switch';
import { QUERY_DISH_INGREDIENTS, QUERY_ALL_INGREDIENTS, ADD_DISH_INGREDIENTS, DELETE_DISH_INGREDIENTS, UPDATE_PUBLIC, PUBLIC_DISHES, QUERY_DISHES } from '@/dashboard/DashboardAPI';

type ModalFunction = () => void;

type Props = {
    dishObj: {
        'name': string, 
        'id': number,
        'public': boolean
    }
    closeModal: ModalFunction
    edit: boolean
};

type DishIngredients = {
    'id': number,
    'name': string
}

type Ingredients = {
    'name': string
}

const DishPopUp = ({dishObj, closeModal, edit}: Props) => {
    const dish = dishObj;
    const closeModalFunc = closeModal;
    const [message, setMessage] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(dish.public);

    const { data: queryData, loading: queryLoadng } = useQuery(QUERY_DISH_INGREDIENTS, {variables: {dishId: dish.id}});
    const ingredientData = useQuery(QUERY_ALL_INGREDIENTS);
    const availableIngredients = ingredientData && ingredientData.data ? ingredientData.data.ingredients.map((names: Ingredients) => {return names.name.toLowerCase()}) : [];
    const [addDishIngredients] = useMutation(ADD_DISH_INGREDIENTS, {refetchQueries: [QUERY_DISH_INGREDIENTS]});
    const [deleteDishIngredients] = useMutation(DELETE_DISH_INGREDIENTS, {refetchQueries: [QUERY_DISH_INGREDIENTS]});
    const [updatePublic] = useMutation(UPDATE_PUBLIC, {refetchQueries: [PUBLIC_DISHES, QUERY_DISHES]});

    const handleAddDish = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            if (message){
                addDishIngredients({variables: {dish: dish.id, name: message}});
            }
            setMessage('');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    
    const handleClick = (id: number) => {
        deleteDishIngredients({variables: {id: id}});
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        updatePublic({variables: {id: dish.id, public: e.target.checked}});
    }

    return (
        <div className='modal'>
            {edit && <div className='switch'><Switch checked={checked} onChange={handleChange}/>Public</div>}
            <div className='poptop'><b>{dish.name}</b></div>
            <a className="close" onClick={closeModalFunc}>
                &times;
            </a>
            <div className='popbody'>Ingredients: </div>
            <ul className={edit ? 'ingred' : 'ingredView'}>
                    {
                        !queryLoadng && queryData && queryData.dishIngredient && queryData.dishIngredient.length > 0 ? queryData.dishIngredient.map((ingredients: DishIngredients) => {
                            return (
                                <li key={ingredients.id} className='ingred-list'>
                                    <div style={availableIngredients.includes(ingredients.name.toLowerCase()) ? {color: 'black'} : {color: 'red'}}>{ingredients.name}</div>
                                    {edit && <button onClick={() => {handleClick(ingredients.id)}}>X</button>}
                                </li>
                            )
                        }) : null
                    }

            </ul>
            {edit && <div className='popsearch-area'>
                <input placeholder='Add an ingredient for this dish' className='popsearch'
                    onKeyDown={(e) => handleAddDish(e)} onChange={e => handleInputChange(e)}
                    value={message}
                ></input>
            </div>}
        </div>
    );
}


export default DishPopUp;
