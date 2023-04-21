import axios from "axios";
import {useContext} from "react"; //need this hook to access global context state
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App"; //importing global context state

const Display = () => {

    const redirect = useNavigate() //same as navigate
    const {user} = useContext(MyContext) //destructuring context values (same as props)

    

    return (
        <>
            <div className="bg-gray-800 flex flex-col height-screen">
                <h3 className="text-blue-500 mt-5 font-bold">Hey {user.firstName}! Welcome to our chat app</h3>
                <h4 className="text-white italic">Feel free to browse around</h4>
                <button className="button bg-amber-500 text-white hover:bg-amber-600 font-bold w-96 h-20 mx-auto my-10 rounded-lg" onClick={() => redirect('/chat')}>Start a new chat!</button>
            </div>
        </>
    )
}

export default Display