import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/appNavbar';
import BookDetails from './pages/book-details';
import Home from './pages/home';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/books/:id/:slug' element={<BookDetails />} />
      </Routes>
    </>
  );
}

export default App;
