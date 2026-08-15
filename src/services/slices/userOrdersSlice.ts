import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getUserOrders = createAsyncThunk('userOrders/get', async () => {
  console.log('getUserOrders: вызываем getOrdersApi()');
  const orders = await getOrdersApi();
  console.log('getUserOrders: получено заказов:', orders.length);
  return orders;
});

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        console.log('userOrders pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        console.error('userOrders rejected:', action.error);
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        console.log(
          'userOrders fulfilled, количество заказов:',
          action.payload?.length || 0
        );
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});

export const { clearUserOrders } = userOrdersSlice.actions;

// Селекторы
export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.userOrders.isLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.userOrders.error;

export default userOrdersSlice.reducer;
