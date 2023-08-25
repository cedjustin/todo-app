import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import todosReducer, { toggleSortOrder, completeTodo, deleteTodo, getTodos, TodoState, addTodo } from "./todosSlice";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { API_BASE_URL, TODOS_ENDPOINT } from "../../../services/api";

describe('todosSlice', () => {

    const initialState: TodoState = {
        status: 'idle',
        todos: [
            { id: 1, title: 'Todo 1', completed: false },
            { id: 2, title: 'Todo 2', completed: true },
        ],
        sort: {
            order: -1,
            property: 'id'
        }
    };

    let store: ToolkitStore<{ todos: TodoState; }, AnyAction, [ThunkMiddleware<{ todos: TodoState; }, AnyAction>]>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                todos: todosReducer,
            },
            preloadedState: {
                todos: initialState
            }
        });
    });

    test('should handle toggleSortOrder by title', () => {

        store.dispatch(toggleSortOrder({ property: 'title' }));
        const sortedAsc = store.getState().todos.todos;

        store.dispatch(toggleSortOrder({ property: 'title' }));
        const sortedDesc = store.getState().todos.todos;

        expect(sortedAsc).not.toEqual(sortedDesc);

    });

    test('should handle toggleSortOrder by id', () => {

        store.dispatch(toggleSortOrder({ property: 'id' }));
        const sortedAsc = store.getState().todos.todos;

        store.dispatch(toggleSortOrder({ property: 'id' }));
        const sortedDesc = store.getState().todos.todos;

        expect(sortedAsc).not.toEqual(sortedDesc);

    });

    test('should handle toggleSortOrder by completed', () => {

        store.dispatch(toggleSortOrder({ property: 'completed' }));
        const sortedAsc = store.getState().todos.todos;

        store.dispatch(toggleSortOrder({ property: 'completed' }));
        const sortedDesc = store.getState().todos.todos;

        expect(sortedAsc).not.toEqual(sortedDesc);

    });

    test('should change the property and sort by asc if a new property if provided', () => {

        store.dispatch(toggleSortOrder({ property: 'completed' }));
        expect(store.getState().todos.sort.property).not.toEqual(initialState.sort.property);
        expect(store.getState().todos.sort.order).not.toEqual(1);

    });

    test('should change the sort order if only property is provided', () => {

        let { property, order } = store.getState().todos.sort
        store.dispatch(toggleSortOrder({ property }));

        expect(store.getState().todos.sort.order).not.toEqual(order);

    });

    test('should not change the sort order if both property and order are the same as the previous values', () => {
        let { property, order } = store.getState().todos.sort
        store.dispatch(toggleSortOrder({ property, order }));

        expect(store.getState().todos.sort.property).toEqual(property);
        expect(store.getState().todos.sort.order).toEqual(order);
    });

    test('should handle completeTodo', () => {
        store.dispatch(completeTodo(1));
        const updatedTodos = store.getState().todos.todos;
        expect(updatedTodos[0].completed).toBe(true);
    });

    test('should handle deleteTodo', () => {
        store.dispatch(deleteTodo(1));
        const remainingTodos = store.getState().todos.todos;
        expect(remainingTodos.length).toBe(1);
        expect(remainingTodos[0].id).toBe(2);
    });

    test('should handle addTodo', () => {
        store.dispatch(addTodo('Todo 3'));
        const updatedTodos = store.getState().todos.todos;
        expect(updatedTodos.length).toBe(initialState.todos.length + 1);
        
        let highestId = initialState.todos.reduce((maxId, todo) => {
            return todo.id > maxId ? todo.id : maxId;
        }, 0);
        expect(updatedTodos[updatedTodos.length - 1].id).toBe(highestId + 1);
    });
});

describe('async actions', () => {
    let store: ToolkitStore<{ todos: TodoState; }, AnyAction, [ThunkMiddleware<{ todos: TodoState; }, AnyAction>]>;;
    let mockAxios: MockAdapter;
    const mockApiResponse = [
        { id: 1, title: 'Todo 1', completed: false },
        { id: 2, title: 'Todo 2', completed: true },
    ];

    beforeEach(() => {
        store = configureStore({
            reducer: {
                todos: todosReducer,
            },
        });
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    test('should fetch todos successfully', async () => {

        mockAxios.onGet(`${API_BASE_URL}${TODOS_ENDPOINT}`).reply(200, mockApiResponse);
        await store.dispatch(getTodos());

        const todos = store.getState().todos.todos;

        expect(todos.length).toBeGreaterThan(0);
        expect(store.getState().todos.status).toBe('success');
    });

    test('should show loading status when fetching todos', async () => {
        mockAxios.onGet(`${API_BASE_URL}${TODOS_ENDPOINT}`).reply(200, mockApiResponse);
        const promise = store.dispatch(getTodos());
        expect(store.getState().todos.status).toBe('loading');
        await promise;
    });

    test('should handle fetch todos error', async () => {
        const mockError = new Error('API error');
        mockAxios.onGet(`${API_BASE_URL}${TODOS_ENDPOINT}`).reply(500, mockError);

        await store.dispatch(getTodos());

        const status = store.getState().todos.status;

        expect(status).toBe('error');
    });
});

