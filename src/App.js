import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/appNavbar';
import BookDetails from './pages/book-details';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux';
import { authAction } from './store/auth-slice';

function App() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const activateSession = async (token) => {
      const userDataResponse = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/fetch-user/`, {
        method: "GET",
        headers: {
          'Authorization': `Token ${token}`,
        }
      })
      if (userDataResponse.ok) {
        let userData = await userDataResponse.json();
        dispatch(authAction.login({
          token: token,
          email: userData.email,
          username: userData.name,
          image: userData.image,
          admin: userData.is_staff
        }))
        setIsLoaded(true);
      }
      else {
        dispatch(authAction.logout())
        setIsLoaded(true);
      }
    }

    try {
      setIsLoaded(false);
      if (cookies.get('token')) {
        activateSession(cookies.get('token'))
      }
      else {
        setIsLoaded(true);
      }
    }
    catch (err) {
      console.log(err);
    }

  }, [])
  return (
    <>
      {isLoaded && (
        <>
          <AppNavbar />
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='/books/:id/:slug' element={<BookDetails />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
