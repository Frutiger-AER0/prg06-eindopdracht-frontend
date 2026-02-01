import { useState } from "react";

function FormComponent({ onSaved }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        author: "",
        date: "",
        image: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({
                    ...formData,
                    image: reader.result.split(',')[1],
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://145.24.237.31:8069/comics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Comic added:", formData);
            if (onSaved) onSaved();
        } catch (e) {
            console.error("Failed to add comic:", e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium">Titel:</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">Descriptie:</label>
                <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
                <label htmlFor="author" className="block text-sm font-medium">Auteur:</label>
                <input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium">Publicatiedatum:</label>
                <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium">Afbeelding:</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Verzenden</button>
        </form>
    );
}

export default FormComponent;