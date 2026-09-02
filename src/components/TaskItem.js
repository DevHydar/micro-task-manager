function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li>
      {task.title} —{" "}
      {task.completed
        ? "Completed ✅"
        : "Not completed ⏳"}

      <button onClick={() => onToggle(task)}>
        {task.completed ? "Undo" : "Complete"}
      </button>

      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  );
}

export default TaskItem;