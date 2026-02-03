import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookPage } from './pages/BookPage';

// On Mock les appels API pour ne pas dépendre d'internet
vi.mock('./api', () => ({
  fetchBookDetail: vi.fn(() => Promise.resolve({
    title: "Harry Potter",
    description: "Un sorcier célèbre."
  })),
  fetchWikipedia: vi.fn(() => Promise.resolve({
    query: { pages: { "123": { extract: "Harry Potter est une série littéraire..." } } }
  }))
}));

// Helper pour entourer le composant avec les Providers nécessaires
const renderWithProviders = (ui: React.ReactNode) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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
// Tests d'intégration pour la page BookPage
describe('BookPage Integration', () => {
  it('Affiche correctement le titre du livre et la description Wikipedia', async () => {
    renderWithProviders(<BookPage />);

    // Vérifie l'état de chargement initial
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();

    // Attend que le titre du livre apparaisse (Mock 1)
    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    // Attend que la description Wikipedia apparaisse (Mock 2)
    await waitFor(() => {
      expect(screen.getByText(/Harry Potter est une série/i)).toBeInTheDocument();
    });
  });
});