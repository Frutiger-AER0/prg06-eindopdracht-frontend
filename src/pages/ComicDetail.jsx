import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";

function ComicDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [comic, setComic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [canDelete] = useState(true);

    useEffect(() => {
        const fetchComic = async () => {
            try {
                const response = await fetch(`http://145.24.237.31:8069/comics/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch comic');
                const data = await response.json();
                setComic(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchComic();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comic? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            const response = await fetch(`http://145.24.237.31:8069/comics/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) throw new Error('Failed to delete comic');
            navigate('/');
        } catch (e) {
            console.error(e);
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
    if (!comic) return <div className="max-w-3xl mx-auto p-6">Comic not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">{comic.title}</h1>
            <div className="text-sm text-gray-600 mb-4">
                Released: {comic.date} — Status: not implemented
            </div>
            <p className="mb-6">{comic.description || <em>No description</em>}</p>
            <p className="mb-6">{comic.author}</p>

            <div className="space-x-2">
                <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
                <Link to={`/comic/${id}/edit`} className="px-3 py-1 border rounded bg-blue-600 text-white">Edit</Link>
                {canDelete && (
                    <button onClick={handleDelete} disabled={deleting} className="px-3 py-1 border rounded bg-red-600 text-white">
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ComicDetail;