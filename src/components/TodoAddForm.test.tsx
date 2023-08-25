import { Provider } from "react-redux";
import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import todosReducer, { TodoState } from "../store/features/todo/todosSlice";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoAddForm from "./TodoAddForm";
import TodosList from "./TodosList";

describe("TodoAddForm", () => {
  let store: ToolkitStore<
    { todos: TodoState },
    AnyAction,
    [ThunkMiddleware<{ todos: TodoState }, AnyAction>]
  >;

  const initialState: TodoState = {
    status: "idle",
    todos: [
      { id: 1, title: "Todo 1", completed: false },
      { id: 2, title: "Todo 2", completed: true },
    ],
    sort: {
      order: -1,
      property: "id",
    },
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "success" },
      },
    });
  });

  test("displays an error when title is empty", () => {
    render(
      <Provider store={store}>
        <TodoAddForm />
      </Provider>
    );

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    const errorMessage = screen.getByText("Title can not be empty");
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays an error when title already exists", () => {
    render(
      <Provider store={store}>
        <TodoAddForm />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const addButton = screen.getByText("Add");

    fireEvent.change(titleInput, { target: { value: "Example Title" } });
    fireEvent.click(addButton);

    fireEvent.change(titleInput, { target: { value: "Example Title" } });
    fireEvent.click(addButton);

    const errorMessage = screen.getByText("Title already exists");
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays an error when todos are still loading", () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "loading" },
      },
    });

    render(
      <Provider store={store}>
        <TodoAddForm />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const addButton = screen.getByText("Add");

    fireEvent.change(titleInput, { target: { value: "Example Title" } });
    fireEvent.click(addButton);

    const errorMessage = screen.getByText("Please wait for todos to load");
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles adding a new todo", () => {
    let { property, order } = store.getState().todos.sort;

    render(
      <Provider store={store}>
        <TodoAddForm />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText("Title");
    const addButton = screen.getByText("Add");

    fireEvent.change(titleInput, { target: { value: "Example Title" } });
    fireEvent.click(addButton);

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    const newTodo = screen.getByText("Example Title");
    expect(newTodo).toBeInTheDocument();

    // the sort order should not change after adding a new todo
    expect(store.getState().todos.sort.property).toEqual(property);
    expect(store.getState().todos.sort.order).toEqual(order);
  });
});
