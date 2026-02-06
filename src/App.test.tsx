/// <reference types="@testing-library/jest-dom" />

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BookPage } from './pages/BookPage';

// 1. On "Mock" (simule) les appels API pour ne pas dépendre d'internet
vi.mock('./api', () => ({
  fetchBookDetail: vi.fn(() => Promise.resolve({
    title: "Harry Potter",
    description: "Un sorcier célèbre."
  })),
  fetchWikipedia: vi.fn(() => Promise.resolve({
    query: { pages: { "123": { extract: "Harry Potter est une série littéraire..." } } }
  }))
}));

// 2. Helper pour entourer le composant avec les Providers nécessaires (Router + Query)
const renderWithProviders = (ui: React.ReactNode) => {
  // On crée un nouveau client pour chaque test pour éviter les effets de bord
  const client = new QueryClient({ 
    defaultOptions: { 
      queries: { retry: false } 
    } 
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/book/OL123W']}>
        <Routes>
          <Route path="/book/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// 3. La suite de tests d'intégration
describe('BookPage Integration', () => {
  it('Affiche correctement le titre du livre et la description Wikipedia', async () => {
    // A. On affiche la page
    renderWithProviders(<BookPage />);

    // B. Vérifie l'état de chargement initial
    // Note: on utilise une regex (/.../i) pour être insensible à la casse (Majuscule/minuscule)
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();

    // C. Attend que le titre du livre apparaisse (Mock 1 - OpenLibrary)
    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    // D. Attend que la description Wikipedia apparaisse (Mock 2 - Wikipedia)
    await waitFor(() => {
      expect(screen.getByText(/Harry Potter est une série/i)).toBeInTheDocument();
    });
  });
});