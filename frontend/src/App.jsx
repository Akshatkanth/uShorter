import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";

function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">uShorter</Link>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/stats" className="nav-link">Stats</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </>
  );
}

export default App;
