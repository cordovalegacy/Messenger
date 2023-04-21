import './App.css';
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react';
import Registration from './components/Registration';
import Login from './components/Login';
import Display from './components/Display';
import { createContext } from 'react'; //creates global state
export const MyContext = createContext() //export global state

function App() {

  const [user, setUser] = useState({})
  console.log("Global User State:", user)

  return (
    //using context provider => value is like props..holds what we want to pass (HAS to be value)
    <MyContext.Provider value={{user, setUser}}> 
      <div className="App">
        <Routes> 
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Display/>} />
        </Routes>
      </div>
    </MyContext.Provider>
  );
}

export default App;
