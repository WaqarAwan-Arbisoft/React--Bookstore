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
import ForgetPassword from './pages/forget-password';
import NewPassword from './pages/new-password';
import NotFound404 from './pages/not-found-404';
import { gapi } from 'gapi-script';
import RequireNonAuth from './components/requireNonAuth';
import RequireAuth from './components/requireAuth';
import Orders from './pages/orders';
import { ToastContainer } from 'react-bootstrap';
import Toast from './components/toast';
import Feed from './pages/feed';
import FriendRequests from './pages/friend-requests';
import LandingPage from './pages/landing-page';
import Favorites from './pages/favorites';
import Chatroom from './pages/chatroom';

function App() {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const authStates = useSelector(states => states.auth)
  const [isLoaded, setIsLoaded] = useState(false);
  const errorToasts = useSelector(state => state.temp.errorToasts);
  const successToasts = useSelector(state => state.temp.successToasts);

  //* Helper function for this module

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
      }))
      setIsLoaded(true);
    }
    else {
      cookies.remove('app_auth_token');
      dispatch(authAction.logout())
      setIsLoaded(true);
    }
  }


  //* Helper function for this module
  useEffect(() => {
    try {
      setIsLoaded(false);
      if (cookies.get('app_auth_token')) {
        activateSession(cookies.get('app_auth_token'))
      }
      else {
        setIsLoaded(true);
      }
    }
    catch (err) {
      console.log(err);
    }

  }, [])
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "533792682925-0qr8e909spqng34b65nm49gujeu5un0h.apps.googleusercontent.com",
      plugin_name: "auth",
    });
  });
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
          <ToastContainer position="top-end" className="mt-5 p-3">
            {errorToasts.map((toast, index) => (
              <Toast key={index} show={true} message={toast.message} />
            ))}
          </ToastContainer>
          <ToastContainer position="top-end" className="mt-5 p-3">
            {successToasts.map((toast, index) => (
              <Toast key={index} show={true} message={toast.message} bg="success" success={true} title="Success" />
            ))}
          </ToastContainer>
          <Routes>
            <Route path='' element={<LandingPage />} />
            <Route path='/books' element={<Home />} />
            <Route path='/books/:id/:slug' element={<BookDetails />} />

            {/* Pages that can only be accessed by Non Authenticated members */}
            <Route element={<RequireNonAuth />}>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgetPassword />} />
              <Route path='/recover/:token' element={<NewPassword />} />
            </Route>

            {/* Pages that can only be accessed by Authenticated members */}
            <Route element={<RequireAuth />}>
              <Route path='/orders' element={<Orders />} />
              <Route path='/feed' element={<Feed />} />
              <Route path='/requests' element={<FriendRequests />} />
              <Route path='/favorites' element={<Favorites />} />
              <Route path='/chatroom' element={<Chatroom />} />
            </Route>

            <Route path='/cart' element={<Cart />} />
            <Route path='/user/:id' element={<Profile />} />
            <Route path='/pageNotFound' element={<NotFound404 />} />
            <Route path='*' element={<NotFound404 />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
