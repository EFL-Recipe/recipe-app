import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import MenuManagement from './MenuManagement';
import RecipeManagement from './RecipeManagement';
import RecipeDetail from './RecipeDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Recipe App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/menus">Menus</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/recipes">Recipes</Link>
                </li>
              </ul>
            </div>
          </nav>

          <Routes>
            <Route path="/menus" element={<MenuManagement />} />
            <Route path="/recipes" element={<RecipeManagement />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/" element={<h2>Welcome to Recipe App</h2>} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;