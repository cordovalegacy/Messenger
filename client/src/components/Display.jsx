import axios from "axios";
import {useContext} from "react"; //need this hook to access global context state
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App"; //importing global context state

const Display = () => {

    const redirect = useNavigate() //same as navigate
    const {user} = useContext(MyContext) //destructuring context values (same as props)

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

    return (
        <>
            <h2 className="text-amber-400 bg-blue-500 p-5">Home</h2>
            <div className="bg-stone-800 flex flex-col height-screen">
                <h3 className="text-white">Hello {user.firstName}</h3>
                <button className="button bg-amber-500 w-40 m-auto rounded-lg" onClick={logoutHandler}>Logout</button>
            </div>
        </>
    )
}

export default Display