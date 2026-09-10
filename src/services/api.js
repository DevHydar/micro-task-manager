import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

API.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (username, password) => {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  return API.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getTasks = () => {
  return API.get("/tasks");
};
export const createTask = (title) => {
  return API.post(
    `/tasks?title=${encodeURIComponent(title)}`,
    {}
  );
};
export const updateTask = (taskId, completed) => {
  return API.put(
    `/tasks/${taskId}?completed=${completed}`,
    {}
  );
};
export const deleteTask = (taskId) => {
  return API.delete(`/tasks/${taskId}`);
};