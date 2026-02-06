import { useQuery } from "@tanstack/react-query";
import { fetchTrendingBooks } from "../api";
import { Link } from "react-router-dom";
// Page d'accueil affichant les livres tendances
export const HomePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingBooks,
  });

  if (isLoading) return <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>Chargement...</div>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Erreur de chargement</p>;

  return (
    <div style={{ width: "100%" }}> {/* Force le conteneur à 100% */}
      
      {/* Bannière de titre */}
      <div style={{ textAlign: "center", marginBottom: "40px", padding: "40px 20px", background: "white", borderRadius: "10px", boxShadow: "0 2px 10px rgba(204, 188, 188, 0.77)" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0, color: "#333" }}>📚 Bibliothèque Municipale</h1>
        <p style={{ color: "#3a3838", marginTop: "10px" }}>Découvrez les tendances du moment</p>
      </div>
      
      <h2 style={{ marginBottom: "20px", marginLeft: "10px", borderLeft: "5px solid #333", paddingLeft: "10px" }}>🔥 Tendances du jour</h2>

      {/* Grille Responsive */}
      <div style={{ 
        display: "grid", 
        // Cette ligne magique fait que les cartes font minimum 220px, et remplissent le reste
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
        gap: "25px",
        padding: "10px" // Petit padding pour éviter que ça colle aux bords
      }}>
        
        {data?.works?.map((book: any) => {
          const id = book.key.split("/").pop();
          return (
            <Link to={`/book/${id}`} key={book.key} style={{ textDecoration: "none" }}>
              <div style={{ 
                background: "white",
                borderRadius: "12px", 
                overflow: "hidden", // Pour que l'image ne dépasse pas
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                height: "100%", // Pour que toutes les cartes aient la même hauteur
                display: "flex",
                flexDirection: "column"
              }}
              // Petit effet au survol (hover) en inline style n'est pas possible facilement en React pur sans CSS, 
              // mais la structure est propre.
              >
                
                {/* Conteneur Image */}
                <div style={{ height: "250px", background: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {book.cover_i ? (
                    <img 
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                      alt={book.title} 
                      style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>📖</span>
                  )}
                </div>

                {/* Conteneur Info */}
                <div style={{ padding: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: "0 0 5px 0", color: "#222" }}>{book.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#666", margin: "0" }}>
                    {book.author_name ? book.author_name[0] : "Auteur inconnu"}
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "15px" }}>
                    <span style={{ color: "#007bff", fontSize: "0.9rem", fontWeight: "bold" }}>Voir le détail →</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};