import { useState } from "react";
import db from "../../lib/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import RequestGPT from "../../lib/gpt-api";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios'

export default function Game() {
    const numOfQns = 10
    const apiUrl = "http://localhost:5000"

    const [questions, setQuestions] = useState([
        {
            "correct_answer": "25 May 1963",
            "question": "When was Ngee Ann Polytechnic founded?",
            "type": "Open-Ended"
          }
    ])
    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState({})
    const [questionIndex, setQuestionIndex] = useState(0)
    const [userInput, setUserInput] = useState()
    const [err, setErr] = useState({
        "isErr": false,
        "title": "",
        "msg": ""
    })
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

        async function getQuestions() {
            const response = await axios.get(`${apiUrl}/questions?topic=${searchParams.get("topic")}`)
            const data = response.data
            if (data.response === "success") {
                setQuestions(data.questions)
            }
        }

        getUser()
        getQuestions()
    }, [])

    async function handleSubmitForm() {
        let tempUser = user
        // Call backend
        try {
            const response = await axios.get(`${apiUrl}/verifyans?userAns=${userInput}&corrAns=${questions[questionIndex].correct_answer}&qnType=${questions[questionIndex].type}&topic=${searchParams.get("topic")}`)
            console.log(response)
            console.log(response.data.isCorrect)
            if (response.data.isCorrect) {
                tempUser.score += 1
            }
        } catch (err) {
            console.error("Failed to verify user answer")
        }

        // Use GPT
        // const gptResponse = await RequestGPT(questions[questionIndex].question, userInput, questions[questionIndex].correct_answer)
        // if (gptResponse === "y") tempUser.score += 1

        setUser(tempUser)
        setUserInput("")

        if (questionIndex + 1 === numOfQns) {
            try {
                const userRef = doc(db, "users", searchParams.get("user"))
                await updateDoc(userRef, {
                    score: user.score
                })
            } catch (err) {
                console.log(err)
            }
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
                    <p className="text-xl">{questions[questionIndex].question}</p>
                    {questions[questionIndex].type === "MCQ" ? 
                        <div className="text-xl mt-2">
                            {questions[questionIndex].options.map((qn) => (
                                <p>{qn}</p>
                            ))}
                        </div>
                        : <></>
                    }
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