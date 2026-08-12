import React, { forwardRef } from 'react';
import { BurgerIngredient } from '@components';
import { TIngredientsCategoryUIProps } from './type';
import { TIngredient } from '@utils-types';
import styles from './ingredients-category.module.css';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(({ title, titleRef, ingredients }, ref) => (
  <>
    <h2 className={`text text_type_main-medium mt-10 mb-6`} ref={titleRef}>
      {title}
    </h2>
    <ul className={styles.items} ref={ref}>
      {ingredients.map((ingredient: TIngredient & { count?: number }) => (
        <BurgerIngredient
          key={ingredient._id}
          ingredient={ingredient}
          count={ingredient.count || 0} // берём count из ингредиента
        />
      ))}
    </ul>
  </>
));
