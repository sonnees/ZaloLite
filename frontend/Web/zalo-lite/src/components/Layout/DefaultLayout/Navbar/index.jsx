import { Routes, Route, Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  let messageImage = "/message-outline.png";
  let contactImage = "/contact-book-outline.png";
  let todoImage = "/todo-outline.png";

  if (location.pathname === "/") {
    messageImage = "/message.png";
  }
  if (location.pathname === "/contact") {
    contactImage = "/contact-selected.png";
  }
  if (location.pathname === "/todo") {
    todoImage = "/todo-selected.png";
  }
  return (
    <div className="fixed h-full w-16 bg-[#0091ff]  pt-8">
      <nav className="w-full">
        <ul className="grid w-full items-center justify-center">
          <li className="px-2 pb-5">
            <img
              src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg"
              className="w-14 rounded-full border "
              alt="avatar"
            />
          </li>
          <li>
            <Link
              to="/"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/" ? "bg-[#006edc]" : ""
              }`}
            >
              <img
                src={messageImage}
                className="h-[24px] w-[24px] items-center justify-center"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/contact" ? "bg-[#006edc]" : ""
              }`}
            >
              <img
                src={contactImage}
                className="h-[24px] w-[24px]"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              className={`flex justify-center p-4 py-5 ${
                location.pathname === "/todo" ? "bg-[#006edc]" : ""
              }`}
            >
              <img src={todoImage} className="h-[22px] w-[22px]" alt="avatar" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
