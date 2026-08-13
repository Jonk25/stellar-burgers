import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
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
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const initialState = {
  bun: null as TConstructorIngredient | null,
  ingredients: [] as TConstructorIngredient[]
};

describe('constructorSlice', () => {
  it('должен обработать addIngredient для булки', () => {
    const state = reducer(initialState, addIngredient(bun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe(bun.name);
    expect(state.bun).toHaveProperty('id');
  });

  it('должен обработать addIngredient для начинки', () => {
    const state = reducer(initialState, addIngredient(main));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(main.name);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  it('должен обработать removeIngredient', () => {
    const addedState = reducer(initialState, addIngredient(main));
    const id = addedState.ingredients[0].id;
    const state = reducer(addedState, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обработать moveIngredient', () => {
    const state1 = reducer(initialState, addIngredient(main));
    const state2 = reducer(state1, addIngredient({ ...main, _id: '2', name: 'Соус' }));
    const state3 = reducer(state2, moveIngredient({ from: 0, to: 1 }));
    expect(state3.ingredients[0].name).toBe('Соус');
    expect(state3.ingredients[1].name).toBe(main.name);
  });

  it('должен обработать clearConstructor', () => {
    const state1 = reducer(initialState, addIngredient(bun));
    const state2 = reducer(state1, addIngredient(main));
    const state3 = reducer(state2, clearConstructor());
    expect(state3.bun).toBeNull();
    expect(state3.ingredients).toHaveLength(0);
  });
});