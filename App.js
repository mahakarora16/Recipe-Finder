import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const searchRecipes = async () => {
    if (!query) return;

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
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '0 20px',
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: 30 }}>
        Recipe Finder 🍳
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Search recipe by name or ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '60%',
            padding: '12px 15px',
            fontSize: 18,
            borderRadius: 5,
            border: '1.5px solid #ccc',
            marginRight: 10,
            outline: 'none',
          }}
          onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
        />
        <button
          onClick={searchRecipes}
          style={{
            padding: '12px 25px',
            fontSize: 18,
            backgroundColor: '#ff5722',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#e64a19')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff5722')}
        >
          Search
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {recipes.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
            No recipes found yet.
          </p>
        )}

        {recipes.map((r) => (
          <div
            key={r.idMeal}
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onClick={() => setSelectedRecipe(r)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={r.strMealThumb}
              alt={r.strMeal}
              style={{ width: '100%', height: 180, objectFit: 'cover' }}
            />
            <div style={{ padding: 15 }}>
              <h3 style={{ margin: '0 0 10px' }}>{r.strMeal}</h3>
              <p style={{ fontSize: 14, color: '#555', height: 40, overflow: 'hidden' }}>
                {r.strInstructions.substring(0, 80)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRecipe && (
        <div
          onClick={closeModal}
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
              onClick={closeModal}
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
