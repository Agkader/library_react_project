// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { BookPage } from "./pages/BookPage";
// Composant principal de l'application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="book/:id" element={<BookPage />} />
          {/* Route 404 simple */}
          <Route path="*" element={<h2>Page introuvable</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;