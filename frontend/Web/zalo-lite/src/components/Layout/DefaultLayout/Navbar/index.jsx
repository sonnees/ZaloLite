import { Routes, Route, Link } from "react-router-dom";

import { publicMainHomeRoutes } from "../../../../routes";

function Navbar() {
  return (
    <div className="flex w-[64px] bg-[#0091ff]  p-3 pt-[32px]  ">
      <nav className="nav__tabs flx flx-col flx-sp-btw ">
        <ul>
          <li>
            <img
              src="https://s120-ava-talk.zadn.vn/2/5/a/5/6/120/5ded83a5856f6d2af9fce6eac4b8d6d2.jpg"
              className="rounded-[50%] border"
              alt="avatar"
            />
          </li>
          <li>
            <Link to="/">
              <img
                src="/message.png"
                className="h-[30px] w-[30px]"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <img
                src="/contact-book.png"
                className="h-[30px] w-[30px]"
                alt="avatar"
              />
            </Link>
          </li>
          <li>
            <Link to="/todo">
              <img
                src="/checkbox.png"
                className="h-[30px] w-[30px]"
                alt="avatar"
              />
            </Link>
          </li>
        </ul>
      </nav>
      {/* <Routes>
                {publicMainHomeRoutes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Routes> */}
    </div>
  );
}

export default Navbar;
