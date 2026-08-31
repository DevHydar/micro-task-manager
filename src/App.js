import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // LOGIN
  const login = () => {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  axios
    .post(
      "http://127.0.0.1:8000/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      const accessToken = response.data.access_token;

      setToken(accessToken);

      console.log("Login successful");
    })
    .catch((error) => {
      console.error("Login failed:", error.response?.data);
    });
};
  // GET TASKS
  const fetchTasks = (accessToken) => {
    axios
      .get("http://127.0.0.1:8000/tasks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
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
  const addTask = () => {
    if (newTask.trim() === "") return;

    axios
      .post(
        `http://127.0.0.1:8000/tasks?title=${encodeURIComponent(newTask)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setTasks((currentTasks) => [
          ...currentTasks,
          response.data,
        ]);

        setNewTask("");
      })
      .catch((error) => {
        console.error("Could not add task:", error);
      });
  };
  const toggleTask = (task) => {
  axios
    .put(
      `http://127.0.0.1:8000/tasks/${task.id}?completed=${!task.completed}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
  axios
    .delete(`http://127.0.0.1:8000/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    })
    .catch((error) => {
      console.error("Could not delete task:", error);
    });
};

  return (
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

          <h3>Your Tasks</h3>

          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />

          <button onClick={addTask}>Add Task</button>

          <ul>
            {tasks.map((task) => (
  <li key={task.id}>
    {task.title} —{" "}
    {task.completed
      ? "Completed ✅"
      : "Not completed ⏳"}

    <button onClick={() => toggleTask(task)}>
      {task.completed ? "Undo" : "Complete"}
    </button>
    <button onClick={() => deleteTask(task.id)}>
  Delete
</button>
  </li>
))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;