import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { IngredientDetailsUI } from '@ui';
import { Preloader } from '../ui/preloader';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const ingredient = ingredients.find((item) => item._id === id);

  if (loading) return <Preloader />;
  if (!ingredient) return <p>Ингредиент не найден</p>;

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
