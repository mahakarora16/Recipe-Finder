import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(() => {});
  }, []);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      if (selectedCategory) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      } else if (query) {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
      } else {
        setLoading(false);
        setRecipes([]);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
      }
    } catch {
      setError('Failed to fetch recipes. Please try again.');
      setRecipes([]);
    }

    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setSelectedRecipe(data.meals[0]);
      }
    } catch {
      setError('Failed to fetch recipe details.');
    }
    setLoading(false);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <h1>Recipe Finder 🍳</h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="theme-toggle"
        style={{ marginBottom: 20 }}
      >
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Improved Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipe by name or ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
          className="search-input"
          disabled={selectedCategory !== ''}
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setQuery('');
            setRecipes([]);
            setSelectedRecipe(null);
          }}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.idCategory} value={cat.strCategory}>
              {cat.strCategory}
            </option>
          ))}
        </select>

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
            onClick={() => fetchRecipeDetails(r.idMeal)}
          >
            <img
              src={r.strMealThumb}
              alt={r.strMeal}
              className="recipe-image"
            />
            <div className="recipe-content">
              <h3 className="recipe-title">{r.strMeal}</h3>
              <p className="recipe-description">
                {r.strInstructions
                  ? r.strInstructions.substring(0, 80) + '...'
                  : 'Click to see details'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div
          onClick={() => setSelectedRecipe(null)}
          className="modal-background"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              className="modal-close-button"
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
            <p style={{ whiteSpace: 'pre-line' }}>
              {selectedRecipe.strInstructions || 'No instructions available.'}
            </p>

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
