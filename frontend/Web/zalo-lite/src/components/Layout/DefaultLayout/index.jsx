import Header from "./Header";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DefaultLayout({ children }) {
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full">
        <Navbar />
        <Sidebar />
      </div>
      <div className=" hidden w-full md:flex">
        <div className=" text-gray-500">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
