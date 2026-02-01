import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";

function EditComic() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        author: "",
        date: "",
        image: "",
    });
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchComic = async () => {
            try {
                const res = await fetch(`http://145.24.237.31:8069/comics/${id}`, {
                    headers: { Accept: "application/json" }
                });
                if (!res.ok) throw new Error(`Failed to fetch comic: ${res.status}`);
                const data = await res.json();
                if (!mounted) return;
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    author: data.author || "",
                    date: formatForDatetimeLocal(data.date),
                    image: data.image || ""
                });
                if (data.image) {
                    if (data.image.startsWith("/")) {
                        setPreviewUrl(`http://145.24.237.31:8069${data.image}`);
                    } else {
                        setPreviewUrl(`data:image/*;base64,${data.image}`);
                    }
                } else {
                    setPreviewUrl("");
                }
            } catch (e) {
                if (mounted) setError(e.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchComic();
        return () => { mounted = false; };
    }, [id]);

    const formatForDatetimeLocal = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            const base64 = dataUrl.split(",")[1];
            setFormData(prev => ({ ...prev, image: base64 }));
            setPreviewUrl(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`http://145.24.237.31:8069/comics/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Update failed: ${res.status} ${text}`);
            }
            navigate(`/comics/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
    if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Comic</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Author</label>
                    <input name="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Publication date</label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 max-h-48 object-contain" />}
                </div>

                <div className="flex space-x-2">
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <Link to={`/comics/${id}`} className="px-4 py-2 border rounded bg-gray-100">View</Link>
                </div>
            </form>
        </div>
    );
}

export default EditComic;