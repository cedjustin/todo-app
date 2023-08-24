import { Alert, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addTodo, toggleSortOrder } from "../store/features/todo/todosSlice";
import { useState } from "react";

interface TitleError {
  show: boolean;
  message: string;
  type?: "error" | "info";
}

const TodoAddForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<TitleError>({
    show: false,
    message: "",
  });
  const sort = useSelector((state: RootState) => state.todos.sort);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let trimmedTitle = title.trim();
    if (trimmedTitle === "")
      return setTitleError({
        show: true,
        message: "Title can not be empty",
      });
    const todoFound = todos.some((todo) => todo.title === trimmedTitle);
    if (todoFound)
      return setTitleError({
        show: true,
        message: "Title already exists",
      });

    if (status === "loading")
      return setTitleError({
        show: true,
        message: "Please wait for todos to load",
        type: "info",
      });

    dispatch(addTodo(trimmedTitle));
    dispatch(toggleSortOrder({ property: sort.property, order: sort.order }));
    setTitle("");
  };

  return (
    <>
      <Alert
        className="mb-2"
        color={titleError.type === "info" ? "gray" : "red"}
        open={titleError.show}
        onClose={() => {
          setTitleError({ show: false, message: "", type: "info" });
        }}
      >
        {titleError.message}
      </Alert>
      <form className="flex items-center" onSubmit={handleSubmit}>
        <input
          className={`h-10 rounded border-2 border-${
            titleError.show ? "red-500" : "black"
          } mr-2`}
          placeholder="Title"
          style={{ paddingInline: 5 }}
          value={title}
          onChange={(text) => {
            setTitleError({ show: false, message: "" });
            setTitle(text.target.value);
          }}
        />
        <Button type="submit">Add</Button>
      </form>
    </>
  );
};

export default TodoAddForm;
