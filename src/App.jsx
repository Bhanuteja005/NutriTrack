import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Bookmarks from "./Components/Bookmarks"
import GoalTracking from "./Components/GoalTracking"
import Home from "./Components/Home"
import Login from './Components/Login'
import Profile from "./Components/Profile"
import Recipes from "./Components/Recipes"
import ShoppingList from "./Components/ShoppingList"
import Sidebar from './Components/Sidebar'
import './config/firebase'
import { auth } from './config/firebase'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);


  return (
    <>
    <div>

   <BrowserRouter>

  <div className='flex gap-[15vh]'>
   <div className='w-[35vh]'>
   {isLoggedIn && (
             <div className='fixed h-screen w-[35vh]'>
             <Sidebar />
           </div>
          )}
   </div>


   <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/recipes" element={<Recipes/>} />
      <Route path="/home" element={<Home />} />
      <Route path="/bookmarks" element={<Bookmarks/>} />
      <Route path="/goaltracking" element={<GoalTracking/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/shoppinglist" element={<ShoppingList/>} />
      
     </Routes>

     </div>
    

     </BrowserRouter>





    </div>
    
      
    </>
  )
}

export default App
