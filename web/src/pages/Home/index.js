import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BarChart2 } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import db from '../../firebase/config';
import { doc, setDoc, getDoc } from "firebase/firestore"; 

export default function Home() {
    const topics = ["something1", "something2", "something3", "something4", "something5", "something6", "something7", "something8"] // should be replaced by API
    const [selectedTopic, setSelectedTopic] = useState()
    const [popupShown, setPopupShown] = useState(false)

    return (
        <div className="text-white bg-gray-900 flex items-center p-10 flex-col duration-150 min-h-screen w-full gap-10">
            <header className='text-center'>
                <img className="icon ml-auto mr-auto" src="OverflowLogo.svg"></img>
                <h1 className="font-bold text-4xl mb-2">Overflow Trivia Game</h1>
                <p>Choose a Trivia Topic below, and start playing! Try to get as many correct as possible!</p>
            </header>
    
            <div className='content flex justify-center flex-wrap gap-10'>
                {topics.map((topic) => (
                    <div key={topic} className={`p-5 cursor-pointer ${selectedTopic === topic ? "bg-cyan-950" : "bg-cyan-600"} hover:bg-cyan-900 rounded-lg`} onClick={() => setSelectedTopic(topic)}>
                        <p>{topic}</p>
                    </div>
                ))}
            </div>
    
            <button 
                className={`py-2 w-1/3 rounded-3xl ${!selectedTopic ? "cursor-not-allowed bg-gray-700" : "bg-amber-600 hover:bg-amber-700"}`} 
                disabled={!selectedTopic} 
                onClick={() => setPopupShown(true)}
            >
                Next
            </button>
    
            <Link to="/leaderboard">
                <div className='side-nav text-white flex flex-row gap-3 py-3 px-5 rounded-xl bg-gray-800 cursor-pointer'>
                    <BarChart2 strokeWidth={3} />
                    <p>Leaderboard</p>
                </div>
            </Link>
            <DetailsPopup popupShown={popupShown} setPopupShown={setPopupShown} topic={selectedTopic} />
        </div>
    )
}

function DetailsPopup({ popupShown, setPopupShown, topic }) {
    const [username, setUsername] = useState("")
    const [err, setErr] = useState("")
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()

        if (username === "") {
            setErr("Username cannot be empty!")
            return
        }

        // Create a new user
        const user = {
            "id": uuidv4(),
            "username": username,
            "timestamp": Date.now(), // Stores in Epoch Time
            "topic": topic,
            "score": 0
        }

        // Add a new user into firebase
        const dbUser =  doc(db, "users", user.id);
        await setDoc(dbUser, user);

        // Check if user is added
        const docSnap = await getDoc(dbUser);
        if (!docSnap.exists()) {
            setErr(`Failed to add User: ${user.username} to database.`)
        } else {
            setErr("") // Reset error msg
            navigate("/game")
        }
    }

    return (
        <div className={`${popupShown ? "fixed" : "hidden"} inset-0 flex w-screen h-screen mt-0 bg-black/50 items-center justify-center z-10 duration-150`}>
            <div className='bg-white text-black p-5 rounded-lg flex flex-col gap-3'>
                <div>
                    <h2 className='font-bold text-xl'>Username (or your name)</h2>
                    <p>How you will be identified on the leaderboard</p>
                </div>
                <div>
                    <input 
                        type='text' 
                        className='border-2 border-gray-600 rounded-lg p-2 w-full' 
                        placeholder='John Doe'
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <p className='text-red-700 text-sm'>{err}</p>
                </div>
                <div className='flex flex-row'>
                    <button className='w-1/3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg' onClick={() => setPopupShown(false)}>Back</button>
                    <button 
                        type='submit' 
                        className='ml-auto w-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-center' 
                        to="/game" 
                        onClick={(e) => handleSubmit(e)}
                    >
                        Start Game!
                    </button>
                </div>
            </div>
        </div>
    )
}