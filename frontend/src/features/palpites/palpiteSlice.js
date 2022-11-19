import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import palpiteService from './palpiteService'

const initialState = {
    palpites: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getPalpites = createAsyncThunk(
    'palpite/getAll',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        return await palpiteService.getPalpites(token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

export const doPalpite = createAsyncThunk(
  'palpite/postPalpite',
    async (palpiteData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        return await palpiteService.doPalpite(palpiteData, token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

export const palpiteSlice = createSlice({
    name: 'palpites',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPalpites.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPalpites.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.palpites = action.payload
            })
            .addCase(getPalpites.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(doPalpite.pending, (state) => {
                state.isLoading = true
            })
            .addCase(doPalpite.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(doPalpite.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = palpiteSlice.actions
export default palpiteSlice.reducer