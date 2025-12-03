import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/auth/Login';
import SignUp from './component/auth/SignUp';
import Home from './component/Home';
import Navbar from './component/NavBar';
import { BackendState } from './contex/backend/BackendState';
import Creatingres from './component/Creatingres';
import Profile from './component/Profile';
import DetailedRecipe from './component/DetailedRecipe';
import FavoritesRecipes from './component/FavoritesRecipes';
import Footer from './component/Footer';
import About from './component/About';
import ChatBot from './component/chatbot/ChatBot';



function App() {
  return (
    <>
      <>
      <BackendState>
      <Router>
        <Navbar/>
      
      {/* <div className="container1"> */}
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/addRecipe" element={<Creatingres/>} />
      <Route path="/favorites" element={<FavoritesRecipes/>} />


      <Route path="/profile" element={<Profile/>} />
      <Route path="/detailedRecipe/:recipeId" element={<DetailedRecipe/>} />
      <Route path="/about" element={<About/>} />



      {/* <Footer/> */}

      <Route path="/chatbot" element={<ChatBot/>} />





      </Routes>
      {/* </div> */}

      </Router>
      </BackendState>
      </>
    </>
  );
}

export default App;
