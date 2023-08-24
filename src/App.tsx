import React from "react";
import TodosList from "./components/TodosList";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import TodoAddForm from "./components/TodoAddForm";

function App() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2">
        <Card className="w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div>
              <Typography variant="h5" color="blue-gray">
                Todo App
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Add a todo
              </Typography>
              <TodoAddForm />
            </div>
          </CardHeader>
          <CardBody className="overflow-y-scroll px-0 h-96">
            <TodosList />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default App;
