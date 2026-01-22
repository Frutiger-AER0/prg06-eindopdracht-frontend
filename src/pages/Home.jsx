import ComicsComponent from "../components/ComicsComponent.jsx";
import { Link } from "react-router";

function Home() {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <header className="w-full max-w-[80vw] py-8">
                <h1 className="text-2xl font-bold text-center">Comic Book Collection</h1>
                <div className="flex justify-center mt-4">
                    <Link to="/create" className="px-4 py-2 bg-green-500 text-white rounded">Add Comic</Link>
                </div>
            </header>
            <main className="w-full max-w-[80vw]">
                <ComicsComponent />
            </main>
        </div>
    );
}

export default Home;