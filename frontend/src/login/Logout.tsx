import { useEffect } from "react";
import { Navigate } from "react-router-dom";

type setFunction = (user: string) => void;

type Props = {
    setUsername: setFunction
}

const Logout = ({setUsername} : Props) => {
    useEffect(() => {
        setUsername('');
        localStorage.clear();
    }, [setUsername]);
    return <Navigate to='/'/>
}

export default Logout;