import reducer, { createOrder, clearOrder } from './orderSlice';

const initialState = {
  order: null as { number: number } | null,
  isLoading: false,
  error: null as string | null
};

const mockOrder = {
  _id: '123',
  status: 'done',
  name: 'Test burger',
  owner: {
    name: 'Test',
    email: 'test@test.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  number: 12345,
  price: 1000
};

describe('orderSlice', () => {
  it('должен обработать createOrder.pending', () => {
    const state = reducer(initialState, createOrder.pending('', []));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать createOrder.fulfilled', () => {
    const payload = {
      success: true,
      name: 'Test burger',
      order: mockOrder
    };
    const state = reducer(initialState, createOrder.fulfilled(payload, '', []));
    expect(state.isLoading).toBe(false);
    expect(state.order).toMatchObject({ number: 12345 });
  });

  it('должен обработать createOrder.rejected', () => {
    const error = new Error('Ошибка создания заказа');
    const state = reducer(initialState, createOrder.rejected(error, '', []));
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  it('должен обработать clearOrder', () => {
    const stateWithOrder = reducer(
      initialState,
      createOrder.fulfilled(
        { success: true, name: 'Test', order: mockOrder },
        '',
        []
      )
    );
    const state = reducer(stateWithOrder, clearOrder());
    expect(state.order).toBeNull();
  });
});
