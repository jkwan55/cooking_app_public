import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@/components/NavBar.css';
import jwt_decode from "jwt-decode";
import { VERIFY_TOKEN, REFRESH_TOKEN } from "@/login/LoginAPI";
import { useMutation } from '@apollo/client';

interface Token {
	username: string;
	exp: number;
	origIat: number;
}

type Props = {
    username: string,
    setUsername: setFunction
}

type setFunction = (user: string) => void;

type Verify = {
	success: boolean
    errors: [[Error]]
    payload: Payload
}

type Refresh = {
	success: boolean
    errors: [[Error]]
    token: string
    refreshToken: string
    payload: Payload
}

type Payload = {
	username: string,
	exp: number,
	origIat: number
}

type Error = {
    message: string
}

const NavBar = ({username, setUsername}: Props) => {

	const [verifyToken] = useMutation(VERIFY_TOKEN, {onCompleted(verifyData: { verifyToken: Verify; }) {handleVerify(verifyData.verifyToken)}});
	const [verifyRefreshToken] = useMutation(REFRESH_TOKEN, {onCompleted(refreshData: { refreshToken: Refresh; }) {handleRefresh(refreshData.refreshToken)}});

    const handleVerify = (data: Verify) => {
		if (data && data.success){
            setUsername(data.payload.username);
		} else {
			if (data.errors) {
                const errors = Object.values(data.errors);
                errors.forEach(errorObject => {
                    errorObject.forEach((error) => {console.log(error.message);}
                )});
            }
		}
	}

	const handleRefresh = (data: Refresh) => {
        if (data && data.success){
            setUsername(data.payload.username);
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
        } else {
            if (data.errors) {
                const errors = Object.values(data.errors);
                errors.forEach(errorObject => {
                    errorObject.forEach((error) => {console.log(error.message);}
                )});
            }
            setUsername('');
            localStorage.clear();
        }
		
	}


    useEffect(() => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token) {
            const userToken = jwt_decode<Token>(token);
            if (userToken.exp * 1000 > Date.now()){
                // not expired token
                verifyToken({variables: {token: token}})
            } else if (refreshToken){
                // use refresh token
                verifyRefreshToken({variables: {refreshToken: refreshToken}});
            } else {
                localStorage.clear();
                setUsername('');
            }
        }
    }, []);






    // default padding for ul is 40px on the left
    return (
        <div className='nav'>
            <div className='nav-child'>
                <ul> 
                    <Link to="/">Home</Link>
                </ul>
                {username ? <ul>
                    <Link to="/fridge">Fridge</Link>
                </ul> : null}
            </div>
            <div className='nav-child'>
                <ul>
                    <Link to="/about">About</Link>
                </ul>
                <ul className='last-child'>
                    {username ? <Link to="/logout">Log out</Link> : <Link to="/login">Login</Link> }
                </ul>
            </div>
            
        </div>
    )
}

export default NavBar;
