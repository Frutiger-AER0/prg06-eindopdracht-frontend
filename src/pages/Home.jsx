import { useEffect, useState } from "react";
import ComicsComponent from "../components/ComicsComponent.jsx";
import { Link } from "react-router";

function Home() {
    const [title, setTitle] = useState("");
    const [debouncedTitle, setDebouncedTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [authors, setAuthors] = useState([]);

    // Debounce title input
    useEffect(() => {
        const id = setTimeout(() => setDebouncedTitle(title.trim()), 300);
        return () => clearTimeout(id);
    }, [title]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch("http://145.24.237.31:8069/comics", {
                    headers: { Accept: "application/json" },
                    cache: "no-store"
                });
                if (!res.ok) return;
                const data = await res.json();
                const items = data.items || [];
                const unique = Array.from(new Set(items.map(i => i.author).filter(Boolean))).sort();
                if (mounted) setAuthors(unique);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen">
            <header className="w-full max-w-[80vw] py-8">
                <h1 className="text-2xl font-bold text-center">Comic Book Collection</h1>
                <div className="flex justify-center mt-4 space-x-3">
                    <Link to="/create" className="px-4 py-2 bg-green-500 text-white rounded">Add Comic</Link>
                </div>

                <div className="mt-6 max-w-xl mx-auto space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Type title to search..."
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by author</label>
                        <select
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">All authors</option>
                            {authors.map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => { setTitle(""); setDebouncedTitle(""); setAuthor(""); }}
                            className="px-3 py-1 border rounded bg-gray-200"
                        >
                            Reset filters
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[80vw]">
                <ComicsComponent filters={{ title: debouncedTitle, author }} />
            </main>
        </div>
    );
}

export default Home;