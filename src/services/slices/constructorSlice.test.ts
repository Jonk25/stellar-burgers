import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

const bun: TIngredient = {
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
};

const main: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен обработать addIngredient для булки', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(bun._id);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обработать addIngredient для начинки', () => {
    const state = reducer(undefined, addIngredient(main));
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(main._id);
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('должен обработать removeIngredient', () => {
    let state = reducer(undefined, addIngredient(main));
    const id = state.ingredients[0].id;
    state = reducer(state, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обработать moveIngredient', () => {
    const main2: TIngredient = { ...main, _id: '3', name: 'Соус' };
    let state = reducer(undefined, addIngredient(main));
    state = reducer(state, addIngredient(main2));
    state = reducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(state.ingredients[0].name).toBe('Соус');
    expect(state.ingredients[1].name).toBe(main.name);
  });

  it('должен обработать clearConstructor', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main));
    state = reducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('не должен изменять состояние при неизвестном экшене', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const action = { type: 'UNKNOWN_ACTION' };
    expect(reducer(initialState, action)).toEqual(initialState);
  });
});
