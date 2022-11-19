import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jogoReducer from '../features/jogos/jogosSlice'
import palpiteReducer from '../features/palpites/palpiteSlice'
import rankingReducer from '../features/ranking/rankingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jogos: jogoReducer,
    palpites: palpiteReducer,
    ranking: rankingReducer,
  },
});
