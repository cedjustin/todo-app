import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getTodos } from "./todoAPI";

export interface Todo {
    id: number
    title: string
    completed: boolean
}

export interface ApiTodo extends Todo {
    userId: number
}

export type SortProperty = keyof Todo

interface Sort {
    order: 1 | -1
    property: SortProperty
}

export interface TodoState {
    status: 'idle' | 'loading' | 'error' | 'success'
    todos: Todo[],
    sort: Sort
}

const initialState: TodoState = {
    status: 'idle',
    todos: [],
    sort: {
        order: -1,
        property: 'id'
    }
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        toggleSortOrder(state, { payload }: PayloadAction<SortProperty>) {
            const property = payload
            const sortOrder = state.sort.property === property ? state.sort.order : 1;
            state.todos = [...state.todos].sort((a, b) => sortOrder * (a[property] > b[property] ? 1 : -1));
            state.sort.order = sortOrder === 1 ? -1 : 1
            state.sort.property = property
        },
        completeTodo(state, { payload }: PayloadAction<number>) {
            const todoId = payload
            const updatedTodos = state.todos.map(todo =>
                todo.id === todoId ? { ...todo, completed: true } : todo
            );
            state.todos = updatedTodos;
        },
        deleteTodo(state, { payload }: PayloadAction<number>) {
            const todoId = payload
            state.todos = state.todos.filter(todo => todo.id !== todoId);;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTodos.pending, (state) => {
            state.status = 'loading'
        }).addCase(getTodos.fulfilled, (state, { payload }) => {
            state.status = 'success'
            state.todos = payload
        }).addCase(getTodos.rejected, (state) => {
            state.status = 'error'
        })
    }
})

export const { toggleSortOrder, completeTodo, deleteTodo } = todosSlice.actions

export default todosSlice.reducer