import './App.css';
import { BrowserRouter as AppRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { AuthProvider } from './utils/AuthContext';
import Pictures from './pages/Pictures';
import Avatar from './pages/Avatar';
import AuthView from './pages/AuthView';
import About from './pages/About';
import ProtectedRoute from './utils/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

function parseUrl(): string {
  const url = new URL(document.URL);
  return 'http://' + url.host;
}

export class Api {
  static url: string = parseUrl();
}

function App() {
  return (
    <AuthProvider>
      <AppRouter>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/pictures"
            element={
              <ProtectedRoute>
                <Pictures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avatar"
            element={
              <ProtectedRoute>
                <Avatar />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthView />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppRouter>
    </AuthProvider>
  )
}

export default App;
