import { useNavigate } from "react-router";
import FormComponent from "../components/FormComponent.jsx";

function AddComic() {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Voeg een Comic toe</h1>
            <FormComponent onSaved={() => navigate("/")} />
        </div>
    );
}

export default AddComic;