
// Fichier : src/api.ts
// Rôle : Gère toutes les communications avec OpenLibrary et Wikipedia

const OPENLIB_BASE_URL = "https://openlibrary.org";
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

// 1. DÉFINITION DES TYPES
// Cela permet à VS Code de t'aider avec l'autocomplétion
export interface SearchParams {
  q?: string;       // Recherche rapide (barre du haut)
  title?: string;   // Titre spécifique
  author?: string;  // Auteur
  subject?: string; // Genre (Fantasy, Horror...)
  isbn?: string;    // Code barre
}

// 2. LES FONCTIONS D'APPEL (FETCH)

/**
 * Récupère les livres tendances du jour.
 * API utilisée : OpenLibrary Trending
 */
export const fetchTrendingBooks = async () => {
  // limit=15 : On en récupère 15 pour avoir une belle grille
  const response = await fetch(`${OPENLIB_BASE_URL}/trending/daily.json?limit=15`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les tendances.");
  }
  
  return response.json();
};

/**
 * Fonction de recherche PUISSANTE et RAPIDE.
 * Gère à la fois la recherche rapide et la recherche avancée.
 */
export const searchBooks = async (filters: SearchParams) => {
  const params = new URLSearchParams();

  // On ajoute les paramètres seulement s'ils sont remplis
  if (filters.q) params.append("q", filters.q);
  if (filters.title) params.append("title", filters.title);
  if (filters.author) params.append("author", filters.author);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.isbn) params.append("isbn", filters.isbn);

  // SÉCURITÉ : Si aucun filtre n'est rempli, on arrête tout de suite
  // Cela évite de lancer une recherche vide qui ferait ramer l'API
  if (Array.from(params).length === 0) {
    return { docs: [] };
  }

  // OPTIMISATION VITESSE (Crucial !)
  // On demande à l'API de ne renvoyer QUE les infos nécessaires.
  // Sans ça, l'API renvoie des méga-octets de données inutiles.
  params.append("fields", "key,title,author_name,cover_i,first_publish_year,isbn");
  
  // On limite le nombre de résultats pour ne pas surcharger le navigateur
  params.append("limit", "20");

  const response = await fetch(`${OPENLIB_BASE_URL}/search.json?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Erreur lors de la recherche.");
  }

  return response.json();
};

/**
 * Récupère les détails complets d'un seul livre.
 * @param id L'identifiant OpenLibrary (ex: "OL12345W")
 */
export const fetchBookDetail = async (id: string) => {
  // On nettoie l'ID au cas où
  const cleanId = id.trim();
  
  const response = await fetch(`${OPENLIB_BASE_URL}/works/${cleanId}.json`);
  
  if (!response.ok) {
    throw new Error("Livre introuvable.");
  }

  return response.json();
};

/**
 * Va chercher la description sur Wikipedia.
 * Utilise l'API MediaWiki avec les paramètres CORS corrects.
 */
export const fetchWikipedia = async (title: string) => {
  if (!title) return null;

  // On encode le titre pour gérer les espaces et caractères spéciaux (ex: "Harry Potter" -> "Harry%20Potter")
  const cleanTitle = encodeURIComponent(title);

// Construction de l'URL avec les bons paramètres
  const url = `${WIKI_API_URL}?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${cleanTitle}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Erreur Wikipedia");
  }

  return response.json();
};