import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import todoReducer from './features/todo/todosSlice'

const store = configureStore({
    reducer: {
        todos: todoReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type AppDispatch = typeof store.dispatch

export default store