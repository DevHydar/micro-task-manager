import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>My First React Task Manager 🚀</h1>
      <h2 style={{ textAlign: "center", color: "#333" }}>Manage your daily tasks with React</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="What do you need to accomplish?"
          style={{ flex: 1, padding: "10px", fontSize: "16px" }}
        />
        <button onClick={addTask} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              marginBottom: "10px",
              backgroundColor: task.completed ? "#e8f5e9" : "#fff",
              textDecoration: task.completed ? "line-through" : "none",
              
            }}
            
          >
            <span onClick={() => toggleComplete(task.id)} style={{ cursor: "pointer", flex: 1 }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>Total Tasks: {tasks.length}</p>
    </div>
  );
}

export default App;