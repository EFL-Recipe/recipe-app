import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from './db';

function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const allMenus = await db.menus.toArray();
      setMenus(allMenus);
      const allRecipes = await db.recipes.toArray();
      setRecipes(allRecipes);
    }
    loadData();
  }, []);

  // 构建菜单树，递归实现层次结构
  function buildTree(menuList, parentId = null) {
    let tree = [];
    menuList.forEach(menu => {
      if (menu.parentId === parentId) {
        let children = buildTree(menuList, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        tree.push(menu);
      }
    });
    return tree;
  }

  const menuTree = buildTree(menus);

  // 添加顶级菜单
  async function handleAddTopLevelMenu() {
    const name = prompt('Enter top-level menu name');
    if (name) {
      await db.menus.add({ name, parentId: null, type: 'folder' });
      const allMenus = await db.menus.toArray();
      setMenus(allMenus);
    }
  }

  // 添加子菜单
  async function handleAddSubmenu(parentId) {
    const name = prompt('Enter submenu name');
    if (name) {
      await db.menus.add({ name, parentId, type: 'folder' });
      const allMenus = await db.menus.toArray();
      setMenus(allMenus);
    }
  }

  // 添加菜谱到菜单
  async function handleAddRecipe(parentId) {
    if (recipes.length === 0) {
      alert('No recipes available. Please add a recipe first.');
      return;
    }
    const recipeList = recipes.map(r => `${r.id}: ${r.title}`).join('\n');
    const selected = prompt(`Select recipe id from:\n${recipeList}`);
    if (selected) {
      const recipeId = parseInt(selected.split(':')[0], 10);
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        await db.menus.add({ name: recipe.title, parentId, type: 'recipe', recipeId: recipe.id });
        const allMenus = await db.menus.toArray();
        setMenus(allMenus);
      } else {
        alert('Invalid recipe selected.');
      }
    }
  }

  return (
    <div className="container">
      <h2>Menus</h2>
      <button onClick={handleAddTopLevelMenu}>Add Top-Level Menu</button>
      <ul>
        {menuTree.map(rootMenu => (
          <MenuItem
            key={rootMenu.id}
            menu={rootMenu}
            recipes={recipes}
            onAddSubmenu={handleAddSubmenu}
            onAddRecipe={handleAddRecipe}
          />
        ))}
      </ul>
    </div>
  );
}

// 递归渲染菜单项
function MenuItem({ menu, recipes, onAddSubmenu, onAddRecipe }) {
  return (
    <li>
      {menu.type === 'folder' ? (
        menu.name
      ) : (
        <Link to={`/recipe/${menu.recipeId}`}>{menu.name}</Link>
      )}
      {menu.type === 'recipe' && (
        <span> - {recipes.find(r => r.id === menu.recipeId)?.title}</span>
      )}
      {menu.type === 'folder' && (
        <>
          <button onClick={() => onAddSubmenu(menu.id)}>Add Submenu</button>
          <button onClick={() => onAddRecipe(menu.id)}>Add Recipe</button>
        </>
      )}
      {menu.children && (
        <ul>
          {menu.children.map(child => (
            <MenuItem key={child.id} menu={child} recipes={recipes} onAddSubmenu={onAddSubmenu} onAddRecipe={onAddRecipe} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default MenuManagement;