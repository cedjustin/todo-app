import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { XMarkIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  Button,
  IconButton,
  Tooltip,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import {
  SortProperty,
  completeTodo,
  deleteTodo,
  toggleSortOrder,
  getTodos,
} from "../store/features/todo/todosSlice";

const TodosList = () => {
  const TABLE_HEAD: SortProperty[] = ["id", "title", "completed"];

  const dispatch: AppDispatch = useDispatch();
  const status = useSelector((state: RootState) => state.todos.status);
  const todos = useSelector((state: RootState) => state.todos.todos);

  const sortData = (column: SortProperty) => {
    dispatch(toggleSortOrder({ property: column }));
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(getTodos());
    }
  }, [dispatch, status]);
  return status === "loading" ? (
    <div className="flex justify-center h-full items-center">
      <Spinner className="h-10 w-10" data-testid="loading-spinner" />
    </div>
  ) : (
    <table className="mt-4 w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {TABLE_HEAD.map((head, index) => (
            <th
              key={index}
              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
              onClick={() => {
                sortData(head);
              }}
              data-testid={`tab-${head}`}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
              >
                {head} <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
              </Typography>
            </th>
          ))}
          <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"></th>
        </tr>
      </thead>
      <tbody>
        {todos.map(({ id, title, completed }, index) => {
          const isLast = index === todos.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={index} data-testid="todo-item">
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {id}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-70"
                >
                  {title.slice(0, 20)}
                  {title.length > 20 ? "..." : ""}
                </Typography>
              </td>
              <td className={classes}>
                <div className="w-max">
                  {completed ? (
                    <Chip
                      variant="ghost"
                      color="green"
                      size="md"
                      value="completed"
                    />
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        dispatch(completeTodo(id));
                      }}
                    >
                      complete
                    </Button>
                  )}
                </div>
              </td>
              <td className={classes}>
                <Tooltip content="Delete">
                  <IconButton
                    variant="text"
                    onClick={() => {
                      dispatch(deleteTodo(id));
                    }}
                    data-testid="delete"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TodosList;
