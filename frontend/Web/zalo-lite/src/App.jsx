import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";

const App = () => (
  <Routes>
    {publicRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={<route.component />} />
    ))}
  </Routes>
);

export default App;
