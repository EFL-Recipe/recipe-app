import Dexie from 'dexie';

// 初始化数据库
const db = new Dexie('RecipeDB');

// 定义数据库模式：menus存储菜单层次，recipes存储菜谱
db.version(1).stores({
  menus: '++id, name, parentId, type, recipeId', // id自动递增，parentId表示父节点，type为folder或recipe
  recipes: '++id, title, text, images, videos' // 菜谱包括标题、文字、图片和视频（以Blob存储）
});

export default db;