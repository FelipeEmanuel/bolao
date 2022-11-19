import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import jogosService from './jogosService'

const initialState = {
    jogo: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getJogos = createAsyncThunk(
    'games/getAll',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        return await jogosService.getJogos(token)
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

export const jogoSlice = createSlice({
    name: 'jogos',
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
            .addCase(getJogos.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getJogos.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.jogos = action.payload
            })
            .addCase(getJogos.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = jogoSlice.actions
export default jogoSlice.reducer