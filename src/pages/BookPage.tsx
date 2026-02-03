import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBookDetail, fetchWikipedia } from "../api";
// Page de détails d'un livre
export const BookPage = () => {
  const { id } = useParams();

  // 1. Appel API Livre
  const { data: book, isLoading: loadingBook } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookDetail(id!),
  });

  // 2. Appel API Wikipedia (Dépendant du livre)
  const { data: wiki, isLoading: loadingWiki } = useQuery({
    queryKey: ["wiki", book?.title],
    queryFn: () => fetchWikipedia(book.title),
    enabled: !!book?.title, // Ne s'exécute que si le livre est chargé
  });

  if (loadingBook) return <p>Chargement du livre...</p>;
  if (!book) return <p>Livre introuvable.</p>;

  // Logique d'extraction du texte Wikipedia (l'API renvoie une structure complexe)
  const getWikiExtract = () => {
    if (!wiki?.query?.pages) return "Pas d'infos Wikipedia trouvées.";
    const pages = wiki.query.pages;
    const pageId = Object.keys(pages)[0];
    return pageId === "-1" ? "Pas d'article Wikipedia pour ce titre précis." : pages[pageId].extract;
  };

  return (
    <div>
      <Link to="/search">← Retour à la recherche</Link>
      
      <div style={{ marginTop: "20px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Colonne Image */}
        <div>
           {book.covers ? (
             <img 
               src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`} 
               alt={book.title}
               style={{ maxWidth: "300px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} 
             />
           ) : (
             <div style={{ width: 200, height: 300, background: "#ccc", display:"flex", alignItems:"center", justifyContent:"center" }}>Pas d'image</div>
           )}
        </div>

        {/* Colonne Infos */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{book.title}</h1>
          <h3>Description (OpenLibrary)</h3>
          <p>{typeof book.description === 'string' ? book.description : book.description?.value || "Pas de description officielle."}</p>

          <hr style={{ margin: "20px 0" }} />
          
          <h3>Savoir encyclopédique (Wikipedia)</h3>
          {loadingWiki ? <p>Recherche sur Wikipedia...</p> : (
            <p style={{ lineHeight: "1.6", background: "#f0f8ff", padding: "15px", borderRadius: "8px" }}>
              {getWikiExtract()}
            </p>
          )}
          
          {/* Lien vers la page Wiki */}
          <a 
            href={`https://en.wikipedia.org/wiki/${book.title}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ display:"inline-block", marginTop: "10px", color: "blue" }}
          >
            Voir l'article complet sur Wikipedia
          </a>
        </div>
      </div>
    </div>
  );
};