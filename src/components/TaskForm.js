import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newTask.trim() === "") return;

    onAddTask(newTask);

    setNewTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={newTask}
        onChange={(event) => setNewTask(event.target.value)}
        placeholder="Add a new task..."
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;