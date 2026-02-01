import { useEffect, useState } from "react";
import { Link } from "react-router";

function ComicsComponent({ filters = {} }) {
    const [comics, setComics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.title, filters.author]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchComics = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set("limit", "9");
                if (currentPage) params.set("page", String(currentPage));
                if (filters.title) params.set("title", filters.title);
                if (filters.author) params.set("author", filters.author);
                const url = `http://145.24.237.31:8069/comics?${params.toString()}`;
                const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" }, cache: "no-store" });
                if (!res.ok) throw new Error(`Failed to fetch comics: ${res.status}`);
                const data = await res.json();
                setComics(data.items || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (e) {
                if (e.name !== "AbortError") setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchComics();
        return () => controller.abort();
    }, [currentPage, filters.title, filters.author]);

    const handlePreviousPage = () => {
        setCurrentPage(p => Math.max(1, p - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(p => Math.min(totalPages, p + 1));
    };

    if (loading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
    if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">Error: {error}</div>;
    if (!comics.length) return <div className="max-w-3xl mx-auto p-6">No comics found</div>;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {comics.map((comic, index) => {
                    const selfHref = comic._links?.self?.href || "";
                    const id = selfHref.split('/').pop();
                    return (
                        <Link key={index} to={`/comics/${id}`} className="block">
                            <div className="border p-4 rounded shadow aspect-square flex flex-col">
                                {comic.image && <img src={`http://145.24.237.31:8069${comic.image}`} alt={comic.title} className="w-full h-96 object-cover mb-2 shrink-0" />}
                                <h2 className="text-lg font-bold grow">{comic.title}</h2>
                                <p className="text-sm">{comic.author}</p>
                                <p className="text-sm">{comic.date ? new Date(comic.date).toLocaleDateString() : ""}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="flex justify-center space-x-4">
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 mb-6 bg-blue-500 text-white rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 mb-6 bg-blue-500 text-white rounded disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    );
}

export default ComicsComponent;