import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Dashboard from '@/dashboard/Dashboard';
import Login from '@/login/Login';
import Logout from '@/login/Logout';
import About from '@/About';
import NavBar from '@/components/NavBar';
import Fridge from '@/Fridge/Fridge';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
	uri: 'https://localhost:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? `JWT ${token}` : "",
		}
	}
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

const App = () => {
	const [username, setUsername] = useState<string>('');

	const setUsernameFunction = (user: string) => {
		setUsername(user);
	}

	useEffect(() => {
		client.resetStore();
	}, [username])
	
	return (
		<ApolloProvider client={client}>
			<Router>
				<NavBar username={username} setUsername={setUsernameFunction}/>
				<Routes>
					<Route path='/' element={<Dashboard username={username}/>} />
					<Route path='/fridge' element={<Fridge username={username}/>}/>
					<Route path='/about' element={<About/>} />
					<Route path='/login' element={<Login setUsername={setUsernameFunction}/>} />
					<Route path='/logout' element={<Logout setUsername={setUsernameFunction}/>} />
				</Routes>
			</Router>
		</ApolloProvider>
	)

}

export default App;
