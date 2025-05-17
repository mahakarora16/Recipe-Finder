import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await res.json();

      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      setRecipes([]);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Recipe Finder 🍳</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipe by name or ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
          className="search-input"
        />
        <button onClick={searchRecipes} className="search-button">
          Search
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {error && <p className="error-message">{error}</p>}

      <div className="recipe-grid">
        {recipes.length === 0 && !loading && !error && (
          <p className="no-recipes">No recipes found yet.</p>
        )}

        {recipes.map((r) => (
          <div
            key={r.idMeal}
            className="recipe-card"
            onClick={() => setSelectedRecipe(r)}
          >
            <img
              src={r.strMealThumb}
              alt={r.strMeal}
              className="recipe-image"
            />
            <div className="recipe-content">
              <h3 className="recipe-title">{r.strMeal}</h3>
              <p className="recipe-description">
                {r.strInstructions.substring(0, 80)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRecipe && (
        <div
          onClick={() => setSelectedRecipe(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 20,
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#555',
              }}
            >
              &times;
            </button>

            <h2>{selectedRecipe.strMeal}</h2>
            <img
              src={selectedRecipe.strMealThumb}
              alt={selectedRecipe.strMeal}
              style={{ width: '100%', borderRadius: 10, marginBottom: 15 }}
            />
            <h3>Instructions</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{selectedRecipe.strInstructions}</p>

            <h3>Ingredients</h3>
            <ul>
              {Array.from({ length: 20 }, (_, i) => i + 1)
                .map((num) => ({
                  ingredient: selectedRecipe[`strIngredient${num}`],
                  measure: selectedRecipe[`strMeasure${num}`],
                }))
                .filter((item) => item.ingredient && item.ingredient.trim() !== '')
                .map((item, idx) => (
                  <li key={idx}>
                    {item.ingredient} - {item.measure}
                  </li>
                ))}
            </ul>

            {selectedRecipe.strSource && (
              <p>
                Source:{' '}
                <a href={selectedRecipe.strSource} target="_blank" rel="noopener noreferrer">
                  {selectedRecipe.strSource}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
