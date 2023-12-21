import { Link } from "react-router-dom"
import { Check, ChevronLeft } from "react-feather"

export default function Leaderboard() {

    return (
        <div className="text-white flex flex-col p-10 items-center bg-gray-900 min-h-screen w-full">
            <header className="text-center">
                <h1 className="font-bold text-4xl mb-2">Leaderboard</h1>
            </header>

            <Link to="/">
                <div className='side-nav text-white flex flex-row gap-2 py-3 px-5 rounded-xl bg-gray-800 cursor-pointer'>
                    <ChevronLeft strokeWidth={3} />
                    <p>Back</p>
                </div>
            </Link>
        </div>
    )
}