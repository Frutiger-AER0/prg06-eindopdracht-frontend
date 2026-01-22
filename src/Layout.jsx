import { Link, Outlet } from "react-router";

function Layout() {
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;