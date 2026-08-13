import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingBoundary from './components/LoadingBoundary';
import Router from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <LoadingBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppProvider>
              <BrowserRouter>
                <AuthProvider>
                  <Router />
                </AuthProvider>
              </BrowserRouter>
            </AppProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </LoadingBoundary>
    </ErrorBoundary>
  );
}

export default App;