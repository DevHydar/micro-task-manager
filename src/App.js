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

  // LOGIN
 const login = () => {
  loginUser(username, password)
    .then((response) => {
      const accessToken = response.data.access_token;

      setToken(accessToken);
      setAuthToken(accessToken);

      console.log("Login successful");
    })
    .catch((error) => {
      console.error(
        "Login failed:",
        error.response?.data
      );
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
      fetchTasks(token);
    }
  }, [token]);
  // ADD TASK
const addTask = (taskTitle) => {
  if (taskTitle.trim() === "") return;

  createTask(taskTitle)
    .then((response) => {
      setTasks((currentTasks) => [
        ...currentTasks,
        response.data,
      ]);
    })
    .catch((error) => {
      console.error("Could not add task:", error);
    });
};
  const toggleTask = (task) => {
  updateTask(task.id, !task.completed)
    .then((response) => {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? response.data
            : currentTask
        )
      );
    })
    .catch((error) => {
      console.error("Could not update task:", error);
    });
};
const deleteTask = (taskId) => {
  deleteTaskAPI(taskId)
    .then(() => {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    })
    .catch((error) => {
      console.error("Could not delete task:", error);
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

          <button onClick={login}>Login</button>
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