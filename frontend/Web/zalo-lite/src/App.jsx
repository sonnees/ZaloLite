import { Routes, Route } from "react-router-dom";
// import { publicRoutes } from "./routes";
import Router from "./routes";

const App = () => (
  // <Routes>
  //   {publicRoutes.map((route, index) => (
  //     <Route key={index} path={route.path} element={<route.component />} />
  //   ))}
  // </Routes>
  <Router />
);

export default App;
