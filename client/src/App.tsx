import AddLogFormComponent from "./components/AddLogComponent";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import LogsViewComponent from "./components/LogsViewComponent";

function App() {
  return (
    <>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<AddLogFormComponent />} />
        <Route path="/add-log" element={<AddLogFormComponent />} />
        <Route path="/logs" element={<LogsViewComponent />} />
      </Routes>
    </>
  );
}

export default App;
