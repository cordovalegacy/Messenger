import { Link } from "react-router-dom"
import axios from 'axios'
import { MyContext } from "../App"
import { useContext } from "react"

const Nav = () => {

    const {redirect} = useContext(MyContext)

    const logoutHandler = () => {
        //empty object and credentials needed for post
        axios
            .post('http://localhost:8000/api/logout', {}, {withCredentials: true}) 
            .then((res) => {
                console.log(res)
                redirect('/login')
            })
            .catch((err) => {
                console.log("Logout Failed: ", err)
            })
        }

    return(
        <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-500 p-1 flex justify-evenly">
            <Link to={'/chat'} className="text-amber-400 hover:text-amber-500 text-lg font-bold p-5">Chat</Link>
            <div className="flex">
            <Link to={'/login'} className="text-amber-400 hover:text-amber-500 text-lg font-bold p-5">Login</Link>
            <button className="button bg-amber-500 hover:bg-amber-600 hover:text-gray-300 text-black p-1 m-auto rounded-lg" onClick={logoutHandler}>Logout</button>
            </div>
        </nav>
    )

}

export default Nav