export interface AuthState {
  user: any;
  loading: boolean;
  error: boolean;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: false,
};

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: any }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: false };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: false };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, user: null, error: true };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export default authReducer; 