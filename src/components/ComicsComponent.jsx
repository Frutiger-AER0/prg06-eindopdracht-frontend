import React, { useState, useEffect } from "react";

function ComicsComponent() {
    const [comics, setComics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchComic = async () => {
        try {
            const response = await fetch(`http://145.24.237.31:8069/comics/?limit=9&page=${currentPage}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setComics(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch (e) {
            console.error("Failed to fetch comics:", e);
        }
    };

    useEffect(() => {
        fetchComic(currentPage);
    }, [currentPage]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-3 gap-4 mb-4">
                {comics.map((comic, index) => (
                    <div key={index} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-bold">{comic.title}</h2>
                        <p>{comic.author}</p>
                        <p>{comic.date}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center space-x-4">
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    );
}

export default ComicsComponent;