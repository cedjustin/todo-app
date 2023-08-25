import { Provider } from "react-redux";
import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import todosReducer, {
  TodoState,
} from "../store/features/todo/todosSlice";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TodosList from "./TodosList";

describe("TodosList", () => {
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

  it("renders the loading spinner when status is loading", () => {
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
        <TodosList />
      </Provider>
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders todos when status is success", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "success" },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    await waitFor(() => {
      const todoElements = screen.getAllByTestId("todo-item");
      expect(todoElements).toHaveLength(2);
    });
  });

  it("should toggle sort by id when id tab is clicked", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "success" },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("tab-id"));
    const sortedTodoElements = screen.getAllByTestId("todo-item");
    expect(sortedTodoElements[0]).toHaveTextContent("2");
    expect(sortedTodoElements[1]).toHaveTextContent("1");

    fireEvent.click(screen.getByTestId("tab-id"));
    expect(sortedTodoElements[0]).toHaveTextContent("1");
    expect(sortedTodoElements[1]).toHaveTextContent("2");
  });

  it("should toggle sort by title when title tab is clicked", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "success" },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("tab-title"));
    const sortedTodoElements = screen.getAllByTestId("todo-item");
    expect(sortedTodoElements[0]).toHaveTextContent("Todo 1");
    expect(sortedTodoElements[1]).toHaveTextContent("Todo 2");

    fireEvent.click(screen.getByTestId("tab-title"));
    expect(sortedTodoElements[0]).toHaveTextContent("Todo 2");
    expect(sortedTodoElements[1]).toHaveTextContent("Todo 1");
  });

  it("should toggle sort by completed when completed tab is clicked", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: { ...initialState, status: "success" },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("tab-completed"));
    const sortedTodoElements = screen.getAllByTestId("todo-item");
    expect(sortedTodoElements[0]).toHaveTextContent("complete");
    expect(sortedTodoElements[1]).toHaveTextContent("completed");

    fireEvent.click(screen.getByTestId("tab-completed"));
    expect(sortedTodoElements[0]).toHaveTextContent("completed");
    expect(sortedTodoElements[1]).toHaveTextContent("complete");
  });

  it('displays "Complete" button for todos with completed set to false', async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: {
          ...initialState,
          status: "success",
        },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    const completeButton = screen.getByText("complete", { exact: true });
    expect(completeButton).toBeInTheDocument();
    expect(completeButton.tagName).toBe("BUTTON");

    const completedChip = screen.getByText("completed", { selector: "span" });
    expect(completedChip).toBeInTheDocument();
  });

  it("completes a todo when Complete button is clicked", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: {
          ...initialState,
          status: "success",
        },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    fireEvent.click(screen.getByText("complete"));

    const todoItems = screen.getAllByTestId("todo-item");
    expect(todoItems[0]).toHaveTextContent("completed");
    expect(todoItems[1]).toHaveTextContent("completed");
  });

  it("deletes a todo when delete button is clicked", async () => {
    store = configureStore({
      reducer: {
        todos: todosReducer,
      },
      preloadedState: {
        todos: {
          ...initialState,
          status: "success",
        },
      },
    });

    render(
      <Provider store={store}>
        <TodosList />
      </Provider>
    );

    fireEvent.click(screen.getAllByTestId("delete")[0]);
    const todoItems = screen.getAllByTestId("todo-item");
    expect(todoItems.length).toBe(1);
  });
});
