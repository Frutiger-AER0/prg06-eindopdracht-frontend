import ComicsComponent from "../components/ComicsComponent.jsx";

function Home() {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <header className="w-full max-w-[80vw] py-8">
                <h1 className="text-2xl font-bold text-center">Comic Book Collection</h1>
            </header>
            <main className="w-full max-w-[80vw]">
                <ComicsComponent />
            </main>
        </div>
    );
}

export default Home;