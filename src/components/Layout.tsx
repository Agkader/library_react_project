import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../api";

// Layout avec barre de navigation et recherche rapide
export const Layout = () => {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // 1. DEBOUNCE : La variable 'value' ne change que 500ms après la dernière frappe
  const [debouncedValue] = useDebounce(text, 500);

  // 2. QUERY : Se lance automatiquement quand debouncedValue change
  const { data } = useQuery({
    queryKey: ["quick-search", debouncedValue],
    queryFn: () => searchBooks({ q: debouncedValue }),
    enabled: debouncedValue.length > 2, // Ne cherche pas si moins de 3 lettres
  });

  // Gestion du submit du formulaire de recherche rapide
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false); // Cache la liste
    if (text) navigate(`/search?q=${text}`);
  };

  return (
    <div>
      <nav style={{ padding: "1rem", background: "#35bbd2", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "1.5rem" }}>
          📚 Ma Biblio
        </Link>
        
        {/* Container de la recherche pour positionner la liste relative à lui */}
        <div style={{ position: "relative", width: "300px" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex" }}>
            <input 
              type="text" 
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Recherche rapide..."
              style={{ width: "100%", padding: "8px", borderRadius: "4px 0 0 4px", border: "none" }}
            />
            <button type="submit" style={{ padding: "8px", borderRadius: "0 4px 4px 0", border: "none", cursor: "pointer", background: "#3a429e", color: "white" }}>🔍</button>
          </form>

          {/* LISTE DES SUGGESTIONS avec hauteur limitée */}
          {showSuggestions && data?.docs && data.docs.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              color: "black",
              border: "1px solid #ccc",
              borderRadius: "0 0 4px 4px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              zIndex: 1000,
              maxHeight: "300px", // Hauteur maximale
              overflowY: "auto", // Défilement vertical
            }}>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}>
                {data.docs.slice(0, 10).map((book: any) => { // Limité à 10 résultats
                  const id = book.key.split("/").pop();
                  return (
                    <li key={book.key} style={{ borderBottom: "1px solid #eee" }}>
                      <Link 
                        to={`/book/${id}`} 
                        onClick={() => setShowSuggestions(false)} // Ferme la liste au clic
                        style={{ display: "block", padding: "10px", textDecoration: "none", color: "#333" }}
                      >
                        <span style={{ fontWeight: "bold" }}>{book.title}</span>
                        <br />
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>{book.author_name?.[0]}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        {/* Bouton Recherche Avancée */}
        <Link 
          to="/search" 
          style={{ 
            background: "#0c0c0c",
            color: "white",
            padding: "8px 16px",
            borderRadius: "25px",
            textDecoration: "none",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#054241"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#0a080a"}
        >
          Recherche Avancée
        </Link>
      </nav>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
};