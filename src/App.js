import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Navbar from "./components/layout/Navbar";
import {
  loginUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskAPI,
  setAuthToken,
} from "./services/api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  // LOGIN
const login = () => {
  setError("");
  setLoading(true);

  loginUser(username, password)
    .then((response) => {
      
      const accessToken = response.data.access_token;

      setToken(accessToken);
      setAuthToken(accessToken);
      setLoading(false);
      setError("");

      console.log("Login successful");
    })
    .catch((error) => {
  console.error(
    "Login failed:",
    error.response?.data
  );

  setError(
    error.response?.data?.detail ||
    "Login failed. Please try again."
  );
  setLoading(false);
});
};
  // GET TASKS
const fetchTasks = () => {
  getTasks()
    .then((response) => {
      setTasks(response.data);
    })
    .catch((error) => {
      console.error("Could not fetch tasks:", error);
    });
};
  // FETCH TASKS AFTER LOGIN
useEffect(() => {
  if (token) {
    fetchTasks();
  }
}, [token]);
  // ADD TASK
const addTask = (taskTitle) => {
  if (taskTitle.trim() === "") return;
  setError("");

  createTask(taskTitle)
    .then((response) => {
      setTasks((currentTasks) => [
        ...currentTasks,
        response.data,
      ]);
      setError("");
    })
    .catch((error) => {
  console.error("Could not add task:", error);

  setError(
    error.response?.data?.detail ||
    "Could not add task. Please try again."
  );
});
};
  const toggleTask = (task) => {
    setError("");
  updateTask(task.id, !task.completed)
    .then((response) => {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? response.data
            : currentTask
        )
      );
      setError("");
    })
    .catch((error) => {
  console.error("Could not update task:", error);

  setError(
    error.response?.data?.detail ||
    "Could not update task. Please try again."
  );
});
};
  const deleteTask = (taskId) => {
  setError("");

  deleteTaskAPI(taskId)
    .then(() => {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      
      );
      setError("");
    })
    .catch((error) => {
  console.error("Could not delete task:", error);

  setError(
    error.response?.data?.detail ||
    "Could not delete task. Please try again."
  );
  
});
};
const logout = () => {
  setToken("");
  setTasks([]);
};
return (
  <div>
    <Navbar 
    token={token}
  onLogout={logout}
  />

    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1>Micro Task Manager ✅</h1>
      {error && (
  <p>{error}</p>
)}

      {!token ? (
        <div>
  <h2>Login</h2>

  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button onClick={login} disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>
</div>
      ) : (
        <div>
          <h2>Welcome, {username} 👋</h2>

          <TaskForm onAddTask={addTask} />

          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      )}
       </div>
  </div>
  );
}

export default App;