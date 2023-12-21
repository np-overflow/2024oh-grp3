import { useSearchParams } from "react-router-dom"
import { useState } from "react";
import db from "../../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore"; 

export default function Game() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState({})

    useState(() => {
        document.title = "Trivia | Game"
        
        async function getUser() {
            const dbUser = doc(db, "users", searchParams.get("id"))
            setUser((await getDoc(dbUser)).data())
        }

        getUser()
    }, [])

    return (
        <div className="text-white bg-gray-900 flex items-center justify-center p-10 flex-col duration-150 min-h-screen w-full gap-10">
            <div className="bg-gray-800 w-10/12 h-5/6 flex p-5 rounded-3xl">
                <header>
                    <h1 className="text-4xl"><a className="font-bold">Trivia Topic:</a> {searchParams.get("topic")}</h1>
                    <h1 className="text-3xl"><a className="font-bold">Username:</a> {user.username}</h1>
                </header>
            </div>            
        </div>
    )
}