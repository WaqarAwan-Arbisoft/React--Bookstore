import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/appNavbar';
import BookDetails from './pages/book-details';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from './store/auth-slice';
import { tempActions } from './store/temp-reducers';
import Cart from './pages/cart';
import Loader from './components/loader';
import Profile from './pages/profile';

function App() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const authStates = useSelector(states => states.auth)
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
          id: userData.id,
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
      {!isLoaded && (
        <div className='text-center my-5'>
          <Loader width="200" height="200" />
        </div>
      )}
      {isLoaded && (
        <>
          <AppNavbar />
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='/books/:id/:slug' element={<BookDetails />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/user/:id' element={<Profile />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
