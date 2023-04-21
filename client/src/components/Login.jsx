import React from "react";
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from "react"; //import context hook
import { MyContext } from "../App"; //import global context state

const Login = () => {

    const { user, setUser } = useContext(MyContext) //destructure values out of context
    const redirect = useNavigate() //same as navigate

    const changeHandler = (e) => { //changing all values based on name attributes and setUser
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const loginHandler = (e) => {
        e.preventDefault()
        axios
            .post('http://localhost:8000/api/login', user, { withCredentials: true })
            .then((res) => {
                console.log(res)
                setUser({
                    firstName: res.data.firstName,
                    email: res.data.email
                })
                redirect('/')
            })
            .catch((err) => {
                console.log("Login Failed :", err)
            })
    }

    return (
        <div className="bg-gray-900 flex flex-col height-screen" onSubmit={loginHandler}>
            <form className="flex flex-col gap-4 mt-4 mb-20 bg-gray-800 w-1/2 mx-auto rounded-lg pt-4">
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="email" className="text-left font-bold text-blue-500">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="email"
                        onChange={changeHandler}
                    />
                </div>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="password" className="text-left font-bold text-blue-500">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="password"
                        onChange={changeHandler}
                    />
                </div>
                <input type="submit" value="Login" className="button bg-amber-400 hover:bg-amber-500 w-1/2 m-auto rounded-lg cursor-pointer" />
                <Link to={'/registration'} className='bg-gray-900 text-amber-400 hover:text-amber-500 py-2 w-1/2 m-auto rounded-t-lg'>Don't have an account? Register!</Link>
            </form>
        </div>
    )
}

export default Login