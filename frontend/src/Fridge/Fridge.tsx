import React, { useState, useEffect } from 'react';
import '@/dashboard/Dashboard.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';

interface Ingredient {
    name: string;
    id: number;
    count: number;
}

type Props = {
    username: string
}

const Fridge = ({username}: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (username === ''){
            navigate('/')
        }
    }, [navigate, username]);


    const [message, setMessage] = useState<string>('');
    const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);

    const QUERY_INGREDIENTS = gql`
        query {
            ingredients {
                name
                id
                count
            }
        }
    `;

    const ADD_INGREDIENT = gql`
        mutation CreateIngredients($name: String!) {
            createIngredients(name: $name) {
                id
                name
                count
            }
        }
    `;

    const DELETE_INGREDIENTS = gql`
        mutation DeleteIngredients($id: ID!) {
            deleteIngredients(id: $id) {
                id
            }
        }
    `;

    useQuery(QUERY_INGREDIENTS, {skip: username === '', onCompleted(queryData: { ingredients: [Ingredient]; }) { handleQuery(queryData.ingredients) }});
    const [addIngredient] = useMutation(ADD_INGREDIENT, {refetchQueries: [QUERY_INGREDIENTS]});
    const [deleteIngredients] = useMutation(DELETE_INGREDIENTS, {refetchQueries: [QUERY_INGREDIENTS]});

    const handleQuery = (data: [Ingredient]) => {
        setIngredientList(data);
    }
    
    const handleAddIngred = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            if (message){
                addIngredient({variables: {name: message}});
            }
            setMessage('');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    
    const handleClick = (id: number) => {
        deleteIngredients({variables: {id: id}});
    }

    return (
        <div>
            <div className='searchbar-area'>
                <input className='searchbar' placeholder='Add a new ingredient'
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleAddIngred(e)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
                    value={message}
                ></input>
            </div>
            <div className='flex-container'>
                <div className='flex-row'>
                    {
                        ingredientList.length > 0 && ingredientList.map((ingredient: Ingredient) => {
                            return (
                            <div className='dish-grid' key={ingredient.id}>
                                <div className='dish-top'>
                                    <CloseIcon onClick={() => {handleClick(ingredient.id)}}/>
                                </div>
                                <div className='dish-name'>
                                    {ingredient.name}
                                </div>
                                {/* <div className='dish-bottom'>
                                    {ingredient.count}
                                </div> */}
                            </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Fridge;
