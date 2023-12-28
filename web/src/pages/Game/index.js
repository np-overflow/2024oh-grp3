import { useState } from "react";
import db from "../../lib/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import RequestGPT from "../../lib/gpt-api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Game() {
    const numOfQns = 10

    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState({})
    const [questionIndex, setQuestionIndex] = useState(0)
    const [userInput, setUserInput] = useState()
    const navigate = useNavigate();

    useState(() => {
        document.title = "Trivia | Game"
        
        async function getUser() {
            try {
                const dbUser = doc(db, "users", searchParams.get("user"))
                setUser((await getDoc(dbUser)).data())
            } catch (err) {
                console.error("Failed to get user with" + err.message)
            }
        }

        getUser()
    }, [])

    async function handleSubmitForm() {
        let tempUser = user
        if (searchParams.get("topic") === "Ngee Ann") {

        } else {
            // Use GPT
            const gptResponse = await RequestGPT("Placeholder", userInput)
            if (gptResponse === "y") tempUser.score += 1
        }
        setUser(tempUser)
        setUserInput("")

        if (questionIndex + 1 === numOfQns) {
            await updateDoc(doc(db, "users", searchParams.get("user"), {
                score: user.score
            }))
            navigate(`/end?user=${user.id}`)
        } else {
            setQuestionIndex(questionIndex + 1)
        }
    }

    return (
        <div className="text-white bg-gray-900 flex items-center justify-center p-10 duration-150 min-h-screen w-full gap-10">
            <div className="bg-gray-800 w-10/12 h-5/6 p-5 rounded-3xl flex flex-col gap-10">
                <header>
                    <h1 className="text-2xl"><a className="font-bold">Trivia Topic:</a> {searchParams.get("topic")}</h1>
                    <h2 className="text-xl"><a className="font-bold">Username:</a> {user.username}</h2>
                </header>
                <section id="question">
                    <p className="text-3xl font-bold">Question {questionIndex + 1}</p>
                    <p className="text-xl">Some question goes here!!!</p>
                    <input
                        className="mt-4 py-2 px-4 rounded-lg bg-white/[0.1] text-lg"
                        placeholder="Your Answer"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    ></input>
                </section>
                <button
                    className={`p-2 rounded-lg ${!userInput ? "cursor-not-allowed bg-gray-700" : "bg-amber-600 hover:bg-amber-700"} duration-200`}
                    disabled={!userInput}
                    onClick={() => handleSubmitForm()}
                >{!userInput ? "Enter your answer" : questionIndex === numOfQns - 1 ? "Finish" : "Submit"}</button>
            </div>            
        </div>
    )
}