import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { getTodos } from "./todoAPI";
import {
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
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
} from "./todosSlice";

const TodosList = () => {
  const TABLE_HEAD: SortProperty[] = ["id", "title", "completed"];

  const dispatch: AppDispatch = useDispatch();
  const status = useSelector((state: RootState) => state.todos.status);
  const todos = useSelector((state: RootState) => state.todos.todos);

  const sortData = (column: SortProperty) => {
    dispatch(toggleSortOrder(column));
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(getTodos());
    }
  }, [dispatch, status]);
  return (
    <Card className="w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div>
          <Typography variant="h5" color="blue-gray">
            Todo list
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            See information about all todos
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="overflow-y-scroll px-0 h-96">
        {status === "loading" ? (
          <div className="flex justify-center h-full items-center">
            <Spinner className="h-10 w-10" />
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
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    </Typography>
                  </th>
                ))}
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"></th>
              </tr>
            </thead>
            <tbody>
              {todos.map(({ id, title, completed }, index) => {
                const isLast = index === todos.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
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
        )}
      </CardBody>
    </Card>
  );
};

export default TodosList;
