import { Link } from "react-router-dom"
import { Check, ChevronLeft } from "react-feather"
import { useEffect, useState } from "react"
import db from "../../firebase/config"
import { collection, onSnapshot } from "firebase/firestore"

export default function Leaderboard() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        document.title = "Trivia | Leaderboard"

        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data())
            setUsers(data)
        })

        return () => unsubscribe()
    }, []);

    return (
        <div className="text-white flex flex-col p-10 items-center bg-gray-900 min-h-screen w-full">
            <header className="text-center">
                <h1 className="font-bold text-4xl mb-2">Leaderboard</h1>
            </header>

            <div>
                {users.map(user => (
                    user.id
                ))}
            </div>

            <Link to="/">
                <div className='side-nav text-white flex flex-row gap-2 py-3 px-5 rounded-xl bg-gray-800 cursor-pointer'>
                    <ChevronLeft strokeWidth={3} />
                    <p>Back</p>
                </div>
            </Link>
        </div>
    )
}