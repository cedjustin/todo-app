import { ApiTodo, Todo } from "./todosSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTodos = createAsyncThunk('todos/getTodos', async (_, thunkAPI) => {
    try {
        const url = 'https://jsonplaceholder.typicode.com/todos';
        const { data } = await axios.get<ApiTodo[]>(url);
        const modifiedData = data.map(({ userId, ...rest }) => rest);
        return modifiedData as Todo[];
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})