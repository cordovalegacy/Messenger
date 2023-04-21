import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import Display from './components/Display';
import Chat from './components/Chat';
import { createContext } from 'react'; //creates global state
import Nav from './components/Nav';
export const MyContext = createContext() //export global state

function App() {

  const [user, setUser] = useState({})
  const redirect = useNavigate()

  return (
    //using context provider => value is like props..holds what we want to pass (HAS to be value)
    <MyContext.Provider value={{user, setUser, redirect}}> 
      <div className="App">
        <Nav />
        <Routes> 
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Display/>} />
          <Route path='/chat' element={<Chat />}/>
        </Routes>
      </div>
    </MyContext.Provider>
  );
}

export default App;
