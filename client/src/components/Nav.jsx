import { Link } from "react-router-dom"
import axios from 'axios'
import { MyContext } from "../App"
import { useContext, useEffect } from "react"

const Nav = () => {

    const { user, setUser, redirect } = useContext(MyContext)

    const logoutHandler = () => {
        //empty object and credentials needed for post
        axios
            .post('http://localhost:8000/api/logout', {}, { withCredentials: true })
            .then((res) => {
                console.log(res)
                setUser(null)
                redirect('/login')
            })
            .catch((err) => {
                console.log("Logout Failed: ", err)
            })
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 p-1 flex justify-around items-center">
            <div className="flex justify-between items-center">
                <Link to={'/'} className="text-amber-400 hover:text-amber-500 text-lg font-bold p-5">Home</Link>
                <Link to={'/chat'} className="text-amber-400 hover:text-amber-500 text-lg font-bold p-5">Chat</Link>
            </div>
            {
                user?.firstName ?
                    <h1 className="text-amber-300 text-lg font-extrabold p-5">{user.firstName}'s Chat</h1> :
                    null
            }
            <div className="flex">
                <Link to={'/login'} className="text-amber-400 hover:text-amber-500 text-lg font-bold p-5">Login</Link>
                <button className="button bg-amber-500 hover:bg-amber-600 hover:text-gray-300 text-black p-1 m-auto rounded-lg" onClick={logoutHandler}>Logout</button>
            </div>
        </nav>
    )

}

export default Nav