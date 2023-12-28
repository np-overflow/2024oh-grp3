"use client"

import Confetti from 'react-confetti'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import db from '../../../lib/firebase-config';

export default function EndGame() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [seconds, setSeconds] = useState(5)
    const [user, setUser] = useState()

    useEffect(() => {
      const timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);
  
      return () => clearInterval(timer);
    }, [seconds]);

    useState(() => {
        document.title = "Trivia | End Game"
        
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
    
    if (user) {
        return (
            <div className="text-white bg-gray-900 flex flex-col items-center justify-center p-10 duration-150 min-h-screen w-full gap-10">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-3">{user.score < 4 ? "Nice Try!" : "Good Job!"}</h1>
                    <p className='text-2xl'>Your score is {user.score}/10!</p>
                </div>
                <div style={{ height: "240px", width: "240px" }}>
                    <CircularProgressbar maxValue={10} value={user.score} text={`${user.score}/10`} />
                </div>
                <Link to="/">
                     <button className="px-6 py-3 bg-white/[0.2] hover:bg-white/[0.1] rounded-3xl">
                        Back to Home
                    </button>
                </Link>
                <Confetti numberOfPieces={seconds !== 0 ? 250 : 0} />
            </div>
        )
    }
}