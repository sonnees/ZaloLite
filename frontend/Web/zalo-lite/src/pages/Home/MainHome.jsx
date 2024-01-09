import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "../../components/Layout";
import { publicMainHomeRoutes } from "../../routes";

import Todo from "../Todo";

const MainHome = () => (
      <Routes>
        {publicMainHomeRoutes.map((route, index) => {
          const Layout = route.layout || DefaultLayout;
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={<Layout><Page/></Layout>}
            />
          );
        })}
      </Routes>
);

export default MainHome;