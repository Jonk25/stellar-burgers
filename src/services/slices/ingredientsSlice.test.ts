import reducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('должен обработать getIngredients.pending', () => {
    const state = reducer(undefined, {
      type: getIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать getIngredients.fulfilled', () => {
    const state = reducer(undefined, {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать getIngredients.rejected', () => {
    const state = reducer(undefined, {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка сети' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('не должен изменять состояние при неизвестном экшене', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    };
    const action = { type: 'UNKNOWN_ACTION' };
    expect(reducer(initialState, action)).toEqual(initialState);
  });
});
