import {gql} from '@apollo/client';

export const QUERY_DISHES = gql`
    query {
        dishes {
            name
            id
            public
        }
    }
`;

export const ADD_DISH = gql`
    mutation CreateDish($name: String!) {
        createDish(name: $name) {
            id
            name
        }
    }
`;

export const QUERY_FAVORITES = gql`
    query {
        favorites {
            id
            dish{
                id
            }
        }
    }
`;

export const ADD_FAVORITE = gql`
    mutation CreateFavorite($dish: ID!){
        createFavorite(dish: $dish){
            dish
        }
    }
`;

export const DELETE_FAVORITE = gql`
    mutation DeleteFavorite($id: ID!){
        deleteFavorite(id: $id){
            id
        }
    }
`;


export const QUERY_DISH_INGREDIENTS = gql`
query DishIngredient($dishId: ID!){
    dishIngredient(dishId: $dishId) {
        id
        name
    }
}
`;

export const QUERY_ALL_INGREDIENTS = gql`
    query {
        ingredients {
            name
        }
    }
`;

export const ADD_DISH_INGREDIENTS = gql`
mutation CreateDishIngredients($dish: ID!, $name: String!) {
    createDishIngredients(dish: $dish, name: $name) {
        dish
        name
    }
}
`;

export const DELETE_DISH_INGREDIENTS = gql`
mutation DeleteDishIngredients($id: ID!) {
    deleteDishIngredients(id: $id) {
        id
    }
}
`;

export const UPDATE_PUBLIC = gql`
mutation UpdatePublic($id: ID!, $public: Boolean!) {
    updatePublic(id: $id, public: $public){
        id
    }
}
`;

export const PUBLIC_DISHES = gql`
query {
    publicDishes{
        id
        name
        owner {
            username
        }
        public
    }
}
`;