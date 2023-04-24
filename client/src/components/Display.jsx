import axios from "axios";
import { useContext, useEffect } from "react"; //need this hook to access global context state
import { MyContext } from "../App"; //importing global context state
import GIF from '../assets/gif-bg-1.gif'

const Display = () => {

    const { user, setUser, redirect } = useContext(MyContext) //destructuring context values (same as props)

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/getLoggedInUser', { withCredentials: true })
            .then((res) => {
                console.log("Logged In User: (chat) ", res.data)
                setUser(res.data)
            })
            .catch((err) => {
                console.log("Something went wrong: (Logged in user) ", err)
                redirect('/login')
            })
    }, [])

    return (
        <div
            className="bg-contain bg-center h-screen bg-no-repeat flex flex-col items-center justify-center bg-gray-800"
            style={{ backgroundImage: `url(${GIF})` }}
        >
            <div className="bg-inherit px-4 flex flex-col items-center mb-40">
                <h3 className="text-blue-500 font-bold">
                    Hey {user.firstName}! Welcome to our chat app
                </h3>
                <h4 className="text-white italic">Feel free to browse around</h4>
                <button
                    className="bg-amber-500 text-white hover:bg-amber-600 font-bold w-96 h-20 mt-8 rounded-lg"
                    onClick={() => redirect("/chat")}
                >
                    Start a new chat!
                </button>
            </div>
        </div>
    );
}

export default Display