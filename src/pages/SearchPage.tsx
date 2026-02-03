import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { searchBooks } from "../api";
// Page de recherche avancée
export const SearchPage = () => {
  // États pour les filtres
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState(""); 
  const [isbn, setIsbn] = useState("");       

  // On debounce CHAQUE champ 
  // on a regroupe tout dans un objet pour n'avoir qu'un seul debounce
  const [filters] = useDebounce({ title, author, subject, isbn }, 800); 

  // La requête écoute l'objet 'filters' qui ne change que quand tu arrêtes d'écrire
  const { data, isLoading } = useQuery({
    queryKey: ["advanced-search", filters], 
    queryFn: () => searchBooks(filters),
    // Ne lance pas la recherche si tout est vide
    enabled: !!(filters.title || filters.author || filters.subject || filters.isbn),
  });

  return (
    <div>
      <h1>Recherche Avancée</h1>
      
      {/* Grille de formulaire */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
        
        <div>
          <label style={{display: "block", fontWeight: "bold"}}>Titre</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
            style={{width: "100%", padding: "8px"}} placeholder="Harry Potter..."
          />
        </div>

        <div>
          <label style={{display: "block", fontWeight: "bold"}}>Auteur</label>
          <input 
            type="text" value={author} onChange={(e) => setAuthor(e.target.value)} 
            style={{width: "100%", padding: "8px"}} placeholder="J.K. Rowling..."
          />
        </div>

        <div>
          <label style={{display: "block", fontWeight: "bold"}}>Sujet / Genre</label>
          <input 
            type="text" value={subject} onChange={(e) => setSubject(e.target.value)} 
            style={{width: "100%", padding: "8px"}} placeholder="Fantasy, Horror, Science..."
          />
        </div>

        <div>
          <label style={{display: "block", fontWeight: "bold"}}>ISBN</label>
          <input 
            type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} 
            style={{width: "100%", padding: "8px"}} placeholder="978-..."
          />
        </div>
      </div>

      {isLoading && <p>Recherche en cours...</p>}

      {/* Résultats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {data?.docs?.map((book: any) => {
           const id = book.key.split("/").pop();
           return (
            <div key={book.key} style={{ background: "white", padding: "10px", border: "1px solid #eee", borderRadius: "8px" }}>
              {/* Petite optimisation : on affiche la couverture petite pour la liste */}
              {book.cover_i && (
                 <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="" style={{float:"right"}} />
              )}
              <h4 style={{margin: "0 0 5px"}}>{book.title}</h4>
              <p style={{fontSize: "0.8rem", color: "#666"}}>{book.author_name?.[0]}</p>
              <Link to={`/book/${id}`} style={{fontSize: "0.9rem", color: "blue"}}>Voir</Link>
            </div>
           )
        })}
      </div>
    </div>
  );
};