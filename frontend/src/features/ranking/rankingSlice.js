import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import rankingService from './rankingService'

const initialState = {
    ranking: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const getRanking = createAsyncThunk(
    'games/getAll',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token
        return await rankingService.getRanking(token)
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

export const rankingSlice = createSlice({
    name: 'ranking',
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
            .addCase(getRanking.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getRanking.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.ranking = action.payload
            })
            .addCase(getRanking.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = rankingSlice.actions
export default rankingSlice.reducer