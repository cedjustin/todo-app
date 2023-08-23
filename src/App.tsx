import React from "react";
import TodosList from "./features/todo/TodosList";

function App() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2">
        <TodosList />
      </div>
    </div>
  );
}

export default App;
