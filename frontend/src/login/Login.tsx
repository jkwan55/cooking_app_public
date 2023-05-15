import React, {useState} from 'react';
import '@/login/Login.css';
import { useNavigate } from 'react-router';

import { useMutation } from '@apollo/client';
import { CREATE_CLIENT, LOGIN_CLIENT } from '@/login/LoginAPI';

type Form = {
    'username': string,
    'password': string
}

type setFunction = (user: string) => void;

type Props = {
    setUsername: setFunction
}

type User = {
    id: number
    username: string
}

type Error = {
    message: string
}

type Auth = {
    success: boolean
    errors: [[Error]]
    token: string
    refreshToken: string
    user: User
}

const Login = ({setUsername} : Props) => {
    const navigate = useNavigate();
    const [exist, setExist] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<String[]>([]);
    
    const [formState, setFormState] = useState<Form>({
        username: '',
        password: ''
    });

    const [createClient] = useMutation(CREATE_CLIENT, {onCompleted(data: { register: Auth; }) {handleMutation(data.register)}})
    const [loginClient] = useMutation(LOGIN_CLIENT, {onCompleted(logData: { tokenAuth: Auth; }) {handleMutation(logData.tokenAuth)}});

    const handleMutation = (data: Auth) => {
        if (data && data.success){
            setUsername(data.user ? data.user.username : formState.username);
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            navigate('/');
        } else {
            setErrorMessage([]);
            if (data.errors){
                const errors = Object.values(data.errors);
                errors.forEach(errorObject => {
                    setErrorMessage(errorObject.map((error) => {return error.message}));
                });
            }
        }
    }

    const handleSubmit = () => {
        if (formState.username && formState.password){
            if (exist){
                loginClient({variables: {username: formState.username, password: formState.password}});
            } else {
                createClient({variables: {username: formState.username, password: formState.password}});
            }
        } else {
            setErrorMessage(['Please fill out the form.']);
        }
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            handleSubmit();
        }
    }

    return(
        <div className='log-page' onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleEnter(e)}>
            <h2>
                {exist ? 'Login' : 'Sign Up'}
            </h2>
            <input
                value={formState.username}
                onChange={(e) => {setFormState({...formState, username: e.target.value})}}
                type='text'
                placeholder='Username'
            />
            <input 
                value={formState.password}
                onChange={(e) => {setFormState({...formState, password: e.target.value})}}
                type='password'
                placeholder='Password'
            />
            <div className='log-bottom'>
                <button onClick={() => {setExist(!exist); setErrorMessage([])}}>
                    {exist ? 'need to create an account?' : 'already have an account?'}
                </button>
                <button onClick={() => handleSubmit()}>
                    {exist ? 'login' : 'create account'}
                </button>
            </div>
            <div className='error'>
                {errorMessage.map((error, i) => {return <ul key={i}>{error}</ul>})}
            </div>
        </div>
    )
}

export default Login;
