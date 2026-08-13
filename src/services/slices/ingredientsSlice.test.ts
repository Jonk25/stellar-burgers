import reducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const initialState = {
  ingredients: [] as TIngredient[],
  isLoading: false,
  error: null as string | null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  it('должен обработать getIngredients.pending', () => {
    const state = reducer(initialState, getIngredients.pending(''));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать getIngredients.fulfilled', () => {
    const state = reducer(
      initialState,
      getIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать getIngredients.rejected', () => {
    const error = new Error('Ошибка загрузки');
    const state = reducer(
      initialState,
      getIngredients.rejected(error, '')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});