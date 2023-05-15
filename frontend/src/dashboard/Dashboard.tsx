import React, { useState, useEffect, useRef } from 'react';
import '@/dashboard/Dashboard.css';
import Popup from 'reactjs-popup';
import DishPopUp from '@/dashboard/DishPopUp';
import DishAdd from '@/dashboard/DishAdd';
import { useQuery, useMutation } from '@apollo/client';
import Fuse from 'fuse.js';
import Collapse from '@/components/Collapse';
import { QUERY_DISHES, ADD_DISH, QUERY_FAVORITES, ADD_FAVORITE, DELETE_FAVORITE, PUBLIC_DISHES } from '@/dashboard/DashboardAPI';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface Cooking {
    name: string; 
    id: number;
    public: boolean;
}

interface PublicCooking extends Cooking{
    owner: Owner;
}

type Owner = {
    username: string;
}

type Props = {
    username: string
}

type Favorite = {
    id: number;
    dish: Dish;
}

type Dish = {
    id: number
}

type ListObject = {
    [dish: number]: number;
}

const Dashboard = ({username}: Props) => {

    const [open, setOpen] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [dishEdit, setDishEdit] = useState<Cooking>({'name': '', 'id': -1, 'public': false});
    const [edit, setEdit] = useState<boolean>(false);
    const [dishList, setDishList] = useState<Cooking[]>([]);
    const [search, setSearch] = useState<string>('');
    const [searchList, setSearchList] = useState<Cooking[]>([]);
    const [openPublic, setOpenPublic] = useState<boolean>(false);
    const [openDish, setOpenDish] = useState<boolean>(false);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [publicHeight, setPublicHeight] = useState<number>(0);
    const [favoriteList, setFavoriteList] = useState<ListObject>({});
    const [publicList, setPublicList] = useState<PublicCooking[]>([]);
    const [publicSearch, setPublicSearch] = useState<PublicCooking[]>([]);


    const contentRef = useRef<HTMLInputElement>(null);
    const publicRef = useRef<HTMLInputElement>(null);
    

    const fuse = new Fuse(dishList, {
        keys: ["name"],
        shouldSort: true
    });

    const publicFuse = new Fuse(publicList, {
        keys: ["name"],
        shouldSort: true
    });

    useQuery(QUERY_DISHES, {skip: username === '', onCompleted(queryData: { dishes: [Cooking]; }) {handleQuery(queryData.dishes)}});
    const [addDish] = useMutation(ADD_DISH, {refetchQueries: [QUERY_DISHES]});
    useQuery(QUERY_FAVORITES, {skip: username === '', onCompleted(favoriteData: { favorites: [Favorite]; }) {handleFavoriteQuery(favoriteData.favorites)}});
    const [addFavorite] = useMutation(ADD_FAVORITE, {refetchQueries: [QUERY_FAVORITES]});
    const [deleteFavorite] = useMutation(DELETE_FAVORITE, {refetchQueries: [QUERY_FAVORITES]});
    useQuery(PUBLIC_DISHES, {onCompleted(publicData: { publicDishes: [PublicCooking]; }) {handlePublicQuery(publicData.publicDishes)}})
    
    const handleFavoriteQuery = (data: [Favorite]) => {
        let favoriteDictionary: { [dish: number]: number } = {};
        data.forEach((favorite: Favorite) => {favoriteDictionary[favorite.dish.id] = favorite.id});
        setFavoriteList(favoriteDictionary);
    }

    const handlePublicQuery = (data: [PublicCooking]) => {
        setPublicList(data);
        publicFuse.setCollection(data);
        if (search){
            handlePublicUpdate();
        } else {
            setPublicSearch(data);
        }

    }

    const handleQuery = (data: [Cooking]) => {
        setDishList(data);
        fuse.setCollection(data);
        if (search){
            handleUpdate();
        } else {
            setSearchList(data);
        }
    }

    const handleUpdate = () => {
        const result = fuse.search(search);
        setSearchList(result.map((item) => {return item.item}));
    }

    const handlePublicUpdate = () => {
        const result = publicFuse.search(search);
        setPublicSearch(result.map((item) => {return item.item}));
    }
    
    useEffect(() => {
        (open || openAdd) ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [open, openAdd]);

    useEffect(() => {
        if (search === ''){
            setSearchList(dishList);
            setPublicSearch(publicList);
        } else {
            handleUpdate();
            handlePublicUpdate();
        }
    }, [search])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const closeModal = () => {
        setOpen(false);
        setEdit(false);
        resetDishEdit();
    }

    const closeModalAdd = () => {
        setOpenAdd(false);
    }

    const resetDishEdit = () => {
        setDishEdit({
            'name': '', 
            'id': -1,
            'public': false
        })
    }

    const handleFavorite = (id: number) => {
        if (id) addFavorite({variables: {dish: id}});
    }

    const handleUnfavorite = (id: number) => {
        if (id) deleteFavorite({variables: {id: id}});
    }

    useEffect(() => {
        const newHeight = contentRef.current && contentRef.current.scrollHeight;
        setContentHeight(newHeight || 0);
    }, [openDish]);

    useEffect(() => {
        const newHeight = publicRef.current && publicRef.current.scrollHeight;
        setPublicHeight(newHeight || 0);
    }, [openPublic]);
 
    return(
        <div>
            <div className='searchbar-area'>
                <input className='searchbar' placeholder='Search for dishes' 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e)}
                    value={search}
                ></input>
                {username && <AddIcon className='svg-icon' onClick={() => {setOpenAdd(true);}}/>}
            </div>
            <Collapse title={'Public Dishes'} setOpen={setOpenPublic} open={openPublic}/>
            <div className='content-parent' ref={publicRef} style={openPublic ? {height: publicHeight + "px"} : {height: "0px"}}>
                {openPublic && <div className='flex-container'>
                    <div className='flex-row'>
                        {
                            publicSearch.length > 0 ? publicSearch.map((dish: PublicCooking) => {
                                return (
                                <div className='dish-grid' key={dish.id} onClick={() => {setOpen(true); setDishEdit({name: dish.name, id: dish.id, public: dish.public});}}>
                                    <div className='dish-top'>
                                        {Object.keys(favoriteList).includes(dish.id.toString()) ? 
                                        <StarIcon onClick={(e) => {e.stopPropagation(); handleUnfavorite(favoriteList[dish.id]);}}/> :
                                        <StarBorderIcon onClick={(e) => {e.stopPropagation(); handleFavorite(dish.id)}}/>}
                                        {username === dish.owner.username && <EditIcon onClick={() => {setEdit(true)}}/>}
                                    </div>
                                    <div className='dish-name'>
                                        {dish.name}
                                    </div>
                                    <div className='dish-bottom'>
                                    </div>
                                </div>
                                )
                            }) : null
                        }
                    </div>
                </div>}
            </div>
            <hr/>
            {username && <div>
                <Collapse title={'My Dishes'} setOpen={setOpenDish} open={openDish}/>
                <div className='content-parent' ref={contentRef} style={openDish ? {height: contentHeight + "px"} : {height: "0px"}}>
                    {openDish && <div className='flex-container'>
                        <div className='flex-row'>
                            {
                                searchList.length > 0 ? searchList.map((dish: Cooking) => {
                                    return (
                                    <div className='dish-grid' key={dish.id} onClick={() => {setOpen(true); setDishEdit({name: dish.name, id: dish.id, public: dish.public});}}>
                                        <div className='dish-top'>
                                            {Object.keys(favoriteList).includes(dish.id.toString()) ? 
                                            <StarIcon onClick={(e) => {e.stopPropagation(); handleUnfavorite(favoriteList[dish.id]);}}/> :
                                            <StarBorderIcon onClick={(e) => {e.stopPropagation(); handleFavorite(dish.id)}}/>}
                                            <EditIcon onClick={() => {setEdit(true)}}/>
                                        </div>
                                        <div className='dish-name'>
                                            {dish.name}
                                        </div>
                                        <div className='dish-bottom'>
                                        </div>
                                    </div>
                                    )
                                }) : null
                            }
                        </div>
                    </div>}
                </div>
                <hr/>
            </div>}
            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                <DishPopUp dishObj={dishEdit} closeModal={closeModal} edit={edit}/>
            </Popup>
            <Popup open={openAdd} closeOnDocumentClick onClose={closeModalAdd}>
                <DishAdd closeModal={closeModalAdd} addDish={addDish}/>
            </Popup>
        </div>
    )
}

export default Dashboard;
