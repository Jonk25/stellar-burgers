import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import { TTabMode, TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { selectConstructorItems } from '../../services/slices/constructorSlice';
import { Preloader } from '../ui/preloader';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const { bun, ingredients: constructorIngredients } = useSelector(
    selectConstructorItems
  );
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Вычисляем счётчики
  const counts: Record<string, number> = {};
  if (bun) {
    counts[bun._id] = (counts[bun._id] || 0) + 2; // Булка добавляется 2 раза (верх + низ)
  }
  constructorIngredients.forEach((item: TConstructorIngredient) => {
    counts[item._id] = (counts[item._id] || 0) + 1;
  });

  // Фильтруем и добавляем поле count к каждому ингредиенту
  const buns = ingredients
    .filter((i: TIngredient) => i.type === 'bun')
    .map((i: TIngredient) => ({ ...i, count: counts[i._id] || 0 }));
  const mains = ingredients
    .filter((i: TIngredient) => i.type === 'main')
    .map((i: TIngredient) => ({ ...i, count: counts[i._id] || 0 }));
  const sauces = ingredients
    .filter((i: TIngredient) => i.type === 'sauce')
    .map((i: TIngredient) => ({ ...i, count: counts[i._id] || 0 }));

  if (loading) return <Preloader />;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
