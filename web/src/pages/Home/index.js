import './Home.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BarChart2 } from 'react-feather';

export default function Home() {
    const topics = ["something1", "something2", "something3", "something4", "something5", "something6", "something7", "something8"] // should be replaced by API
    const [selectedTopic, setSelectedTopic] = useState()

    return (
        <div className="text-white container bg-gray-900 flex items-center p-10 flex-col space-y-10 duration-150">
            <header className='text-center'>
            {/* <img></img> */}
            <h1 className="font-bold text-4xl mb-2">Overflow Trivia Game</h1>
            <p>Choose a Trivia Topic below, and start playing! Try to get as many correct as possible!</p>
            </header>
    
            <div className='content flex content-center align-center flex-wrap gap-10'>
            {topics.map((topic) => (
                <div className={`p-5 cursor-pointer ${selectedTopic === topic ? "bg-cyan-950" : "bg-cyan-600"} hover:bg-cyan-900 rounded-lg`} onClick={() => setSelectedTopic(topic)}>
                <p>{topic}</p>
                </div>
            ))}
            </div>
    
            <button className={`py-2 w-1/3 rounded-3xl ${!selectedTopic ? "cursor-not-allowed bg-gray-700" : "bg-amber-600 hover:bg-amber-700"}`} disabled={!selectedTopic}>Start Game!</button>
    
            <Link to="/leaderboard">
                <div className='side-nav text-white flex flex-row gap-3 py-3 px-5 rounded-xl bg-gray-800 cursor-pointer'>
                    <BarChart2 strokeWidth={3} />
                    <p>Leaderboard</p>
                </div>
            </Link>
        </div>
    )
}