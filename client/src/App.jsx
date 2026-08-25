import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">QuickPaste</Link>
        <Link to="/" className="nav-new">+ New Paste</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CreatePaste />} />
          <Route path="/p/:slug" element={<ViewPaste />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;