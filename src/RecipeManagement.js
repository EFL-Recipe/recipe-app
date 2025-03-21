import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 确保导入 Link 组件
import db from './db';

function RecipeManagement() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ title: '', text: '', images: [], videos: [] });

  useEffect(() => {
    async function loadRecipes() {
      const allRecipes = await db.recipes.toArray();
      setRecipes(allRecipes);
    }
    loadRecipes();
  }, []);

  async function addRecipe() {
    const recipeData = {
      title: newRecipe.title,
      text: newRecipe.text,
      images: newRecipe.images.map(file => file),
      videos: newRecipe.videos.map(file => file)
    };
    const id = await db.recipes.add(recipeData);
    setRecipes([...recipes, { ...recipeData, id }]);
    setNewRecipe({ title: '', text: '', images: [], videos: [] });
  }

  return (
    <div className="container">
      <h2>Recipes</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
      <h3>Add New Recipe</h3>
      <input
        type="text"
        value={newRecipe.title}
        onChange={e => setNewRecipe({ ...newRecipe, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={newRecipe.text}
        onChange={e => setNewRecipe({ ...newRecipe, text: e.target.value })}
        placeholder="Recipe Text"
      />
      <input
        type="file"
        multiple
        onChange={e => {
          const files = Array.from(e.target.files);
          setNewRecipe(prev => ({
            ...prev,
            images: [...prev.images, ...files]
          }));
        }}
      />
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={e => {
          const files = Array.from(e.target.files);
          setNewRecipe(prev => ({
            ...prev,
            videos: [...prev.videos, ...files]
          }));
        }}
      />
      <button onClick={addRecipe}>Add Recipe</button>
    </div>
  );
}

export default RecipeManagement;