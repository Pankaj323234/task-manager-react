import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  

  // Load from localStorage
  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem("tasks"));
  //   if (saved) setTasks(saved);
  // }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p>
        Total: {tasks.length} | Completed: {tasks.filter(t => t.completed).length}
      </p>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setTasks([])}>Clear All</button>
      </div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {filteredTasks.map((t, index) => (
          <li key={index}>
            <span
              onClick={() => toggleTask(index)}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              {t.text}
            </span>

            <button onClick={() => deleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p>No tasks available</p>}
    </div>
  );
}

export default App;