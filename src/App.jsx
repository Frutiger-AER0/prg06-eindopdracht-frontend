import { createBrowserRouter, RouterProvider } from "react-router";
import Error from "./components/Error.jsx";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import AddComic from "./pages/AddComic.jsx";
import ComicDetail from "./pages/ComicDetail.jsx";
import EditComic from "./pages/EditComic.jsx";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/create",
                element: <AddComic />,
            },

            {
                path: "/comics/:id",
                element: <ComicDetail />,
            },
            {
                path: "/comics/:id/edit",
                element: <EditComic />,
            }
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App
