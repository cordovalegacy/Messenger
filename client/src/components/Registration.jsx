import React from "react";
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { useContext } from "react";
import { MyContext } from "../App";

const Registration = () => {

    const { user, setUser } = useContext(MyContext)
    const redirect = useNavigate()

    const changeHandler = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const registrationHandler = (e) => {
        e.preventDefault()
        axios
            .post('http://localhost:8000/api/register', user, {withCredentials: true})
            .then((res) => {
                console.log("Registered User: ", res.data)
                setUser({
                    firstName: res.data.firstName,
                    email: res.data.email
                })
                redirect('/')
            })
            .catch((err) => {
                console.log("Something went wrong: ", err)
            })
        }

    return (
        <>
        <h2 className="text-amber-400 bg-blue-500 p-5">Registration</h2>
            <form className="bg-stone-800 flex flex-col height-screen" onSubmit={registrationHandler}>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="firstName" className="text-left text-blue-500">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="first name"
                        onChange={changeHandler}
                    />
                </div>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="lastName" className="text-left text-blue-500">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="last name"
                        onChange={changeHandler}
                    />
                </div>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="email" className="text-left text-blue-500">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="email"
                        onChange={changeHandler}
                    />
                </div>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="password" className="text-left text-blue-500">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="password"
                        onChange={changeHandler}
                    />
                </div>
                <div className="flex flex-col w-1/2 m-auto">
                    <label htmlFor="confirmPassword" className="text-left text-blue-500">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="bg-stone-200 border border-blue-500 rounded-lg text-center p-1"
                        placeholder="confirm password"
                        onChange={changeHandler}
                    />
                </div>
                <input type="submit" value="Register" className="button bg-amber-400 w-1/2 m-auto rounded-lg cursor-pointer"/>
            <Link to={'/login'} className='bg-stone-800 text-amber-400 hover:text-amber-500 py-2 w-1/2 m-auto'>Already have an account? Login!</Link>
            </form>
        </>
    )
}

export default Registration