import reducer, {
  loginUser,
  registerUser,
  getUser,
  userLogout,
  authChecked
} from './userSlice';

const initialState = {
  isAuthChecked: false,
  user: null as { email: string; name: string } | null,
  loginError: null as string | null,
  loginRequest: false
};

const mockUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('userSlice', () => {
  it('должен обработать loginUser.pending', () => {
    const state = reducer(initialState, loginUser.pending('', { email: '', password: '' }));
    expect(state.loginRequest).toBe(true);
    expect(state.loginError).toBeNull();
  });

  it('должен обработать loginUser.fulfilled', () => {
    const state = reducer(
      initialState,
      loginUser.fulfilled(mockUser, '', { email: 'test@test.com', password: '123' })
    );
    expect(state.loginRequest).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обработать loginUser.rejected', () => {
    const error = new Error('Неверный логин или пароль');
    const state = reducer(
      initialState,
      loginUser.rejected(error, '', { email: '', password: '' })
    );
    expect(state.loginRequest).toBe(false);
    expect(state.loginError).toBe('Неверный логин или пароль');
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обработать registerUser.fulfilled', () => {
    const state = reducer(
      initialState,
      registerUser.fulfilled(mockUser, '', { email: '', name: '', password: '' })
    );
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обработать getUser.fulfilled', () => {
    const state = reducer(
      initialState,
      getUser.fulfilled({ user: mockUser, success: true }, '')
    );
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обработать userLogout', () => {
    const loggedInState = reducer(
      initialState,
      loginUser.fulfilled(mockUser, '', { email: '', password: '' })
    );
    const state = reducer(loggedInState, userLogout());
    expect(state.user).toBeNull();
  });

  it('должен обработать authChecked', () => {
    const state = reducer(initialState, authChecked());
    expect(state.isAuthChecked).toBe(true);
  });
});