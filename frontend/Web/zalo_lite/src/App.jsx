import styles from "./style";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login/LoginForm";

import Main from "./pages/home/MainHome";

const App = () => (
  // <div className="bg-primary w-full overflow-hidden">
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Main />} />
    </Routes>
  // </div>
);

export default App;
