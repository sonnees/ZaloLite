import Header from "./Header";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DefaultLayout({ children }) {
    return (
        <div className=" container w-full h-screen flex ">
            <div className="flex flex-wrap bg-gray-100 ">
                <Navbar />
                <Sidebar />
            </div>
            <div className="flex flex-wrap">
                <div className="p-4 text-gray-500">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DefaultLayout;
