import { CategoriesCollection } from '../db/models/categoory.js';

export const getCategories = () => {
  return CategoriesCollection.find({}).sort({ name: 1 });
};
