import { getTodos } from './todoAPI';
import todosReducer, {
    Todo,
    TodoState, completeTodo, deleteTodo, toggleSortOrder
} from './todosSlice';

describe('todosSlice', () => {

    const initialState: TodoState = {
        status: 'idle',
        todos: [{ id: 1, title: 'title 1', completed: false }, { id: 2, title: 'title 2', completed: true }],
        sort: {
            order: -1,
            property: 'id'
        }
    }

    const reversedTodos: Todo[] = [{ id: 1, title: 'title 1', completed: false }, { id: 2, title: 'title 2', completed: true }]

    it('should handle initial state', () => {
        const initialStateValues = {
            status: 'idle',
            todos: [],
            sort: {
                order: -1,
                property: 'id'
            }
        }
        expect(todosReducer(undefined, { type: 'unknown' })).toEqual(initialStateValues)
    });

    it('should toggle sort order by id', () => {
        let todosState = todosReducer(initialState, toggleSortOrder('id'))
        expect(todosState.todos).toEqual([{ id: 2, title: 'title 2', completed: true }, { id: 1, title: 'title 1', completed: false }])
        expect(todosState.sort).toEqual({ order: 1, property: 'id' })

        todosState = todosReducer({ ...initialState, sort: { order: 1, property: 'id' } }, toggleSortOrder('id'))
        expect(todosState.todos).toEqual(initialState.todos)
        expect(todosState.sort).toEqual({ order: -1, property: 'id' })
    })

    it('should toggle sort order by title', () => {
        let todosState = todosReducer(initialState, toggleSortOrder('title'))
        expect(todosState.todos).toEqual(initialState.todos)
        expect(todosState.sort).toEqual({ order: -1, property: 'title' })

        todosState = todosReducer({ ...initialState, sort: { order: 1, property: 'title' } }, toggleSortOrder('title'))
        expect(todosState.todos).toEqual(reversedTodos)
        expect(todosState.sort).toEqual({ order: -1, property: 'title' })
    })

    it('should toggle sort order by completed', () => {
        let todosState = todosReducer(initialState, toggleSortOrder('completed'))
        expect(todosState.todos).toEqual(initialState.todos)
        expect(todosState.sort).toEqual({ order: -1, property: 'completed' })

        todosState = todosReducer({ ...initialState, sort: { order: 1, property: 'completed' } }, toggleSortOrder('completed'))
        expect(todosState.todos).toEqual(reversedTodos)
        expect(todosState.sort).toEqual({ order: -1, property: 'completed' })
    })

    it('should complete a todo', () => {
        const todosState = todosReducer(initialState, completeTodo(initialState.todos[0].id))
        expect(todosState.todos[0].completed).toBe(true)
    })

    it('should delete a todo', () => {
        const todosState = todosReducer(initialState, deleteTodo(initialState.todos[0].id))
        expect(todosState.todos.length).toBe(1)
    })

    it('should handle getTodos.pending', () => {
        const todosState = todosReducer(undefined, getTodos.pending)
        expect(todosState.status).toBe('loading')
    })

    it('should handle getTodos.fulfilled', () => {
        const todosState = todosReducer(undefined, getTodos.fulfilled)
        expect(todosState.status).toBe('success')
    })

    //TODO - mock getTodo fn

    it('should handle getTodos.rejected', () => {
        const todosState = todosReducer(undefined, getTodos.rejected)
        expect(todosState.status).toBe('error')
    })

});
