import { Link } from "react-router-dom"
import { ChevronLeftIcon, TrophyIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import db from "../../lib/firebase-config"
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
        <div className="text-white flex flex-col p-10 items-center bg-gray-900 min-h-screen w-full gap-10">
            <header className="text-center">
                <h1 className="font-bold text-4xl mb-2">Leaderboard</h1>
            </header>

            <div className="flex flex-col gap-2 w-full items-center">
                {users.sort((a, b) => b.score - a.score).map((user, index) => (
                    <LeaderboardItem key={user.id} user={user} index={index} />
                ))}
            </div>

            <Link to="/">
                <div className='side-nav text-white flex flex-row items-center gap-2 py-3 px-5 rounded-xl bg-gray-800 cursor-pointer'>
                    <ChevronLeftIcon className="w-5 h-5" strokeWidth={3} />
                    <p>Back</p>
                </div>
            </Link>
        </div>
    )
}

function LeaderboardItem({ user, index }) {

    const colours = {
        0: "text-amber-400", // 1st Place
        1: "text-stone-400", // 2nd Place
        2: "text-yellow-700", // 3rd Place
    }

    return (
        <div className={`flex flex-row items-center bg-white/[.09] rounded-xl p-4 w-1/2 ${index === 2 ? "mb-4" : ""}`}>
            {index < 3 ? <TrophyIcon className={`w-8 h-8 ${colours[index]}`} /> : <></>}
            <div className={`${index < 3 ? "ml-3" : ""}`}>
                <h3 className="font-bold text-2xl">{ user.username }</h3>
                <p className="text-white/[.9]">{ user.topic }</p>
            </div>
            <p className="ml-auto text-lg"><span className="font-bold">Points: </span>{ user.score }</p>
        </div>
    )
}