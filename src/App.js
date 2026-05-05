import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDate, setEditDate] = useState("");

  // Load from localStorage
  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem("tasks"));
  //   if (saved) setTasks(saved);
  // }, []);

  // Save to localStorage
  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify(tasks));
  // }, [tasks]);



  

  useEffect(() => {
  axios.get("http://localhost:5000/tasks")
    .then((res) => {
      setTasks(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
  document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // const addTask = () => {
  //   if (!task.trim()) return;
  //   setTasks([...tasks, { text: task, completed: false }]);
  //   setTask("");
  // };

    const addTask = () => {
      if (task.trim() === "") return;

      axios.post("http://localhost:5000/tasks", {
        text: task,
        status: status,
        priority: priority,
        dueDate: dueDate
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTask("");
        setStatus("");
        setPriority("");
        setDueDate("");
      });
    };


    const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((t) => t._id !== id));
      });
    };

    // const toggleTask = (id) => {
    // axios.put(`http://localhost:5000/tasks/${id}`)
    //   .then((res) => {
    //     setTasks(tasks.map((t) => t._id === id ? res.data : t));
    //   });
    // };

    const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.status === "Completed";
      if (filter === "pending") return t.status === "Pending";
      return true;
    })
    .filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

    const clearAllTasks = () => {
      axios.delete("http://localhost:5000/tasks")
        .then(() => {
          setTasks([]);
        });
    };

    return (
    <div className="app card shadow p-4">
      {/* <div className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => setFilter("all")}>All Tasks</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div> */}
      <div className="container mt-4">
        <header className="header mb-4">
          <h1 className="text-center mb-0">📋 Task Manager</h1>
        </header>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
        <p className="text-center fw-bold mt-3" >
          Total: {tasks.length} | Completed: {tasks.filter(t => t.status === "Completed").length}
        </p>
        <div className="mb-3">
          <button className="btn btn-outline-primary me-2" onClick={() => setFilter("all")}>All</button>
          <button className="btn btn-outline-success me-2" onClick={() => setFilter("completed")}>Completed</button>
          <button className="btn btn-outline-warning me-2" onClick={() => setFilter("pending")}>Pending</button>
          <button className="btn btn-outline-danger" onClick={clearAllTasks}>Clear All</button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="🔍 Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="card p-3 mb-3 shadow-sm">

          {/* Task Input */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          {/* Status */}
          <select
            className="form-select mb-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority */}
          <select
            className="form-select mb-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            className="form-control mb-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Add Button */}
          <button
            className="btn btn-success w-100"
            onClick={addTask}
          >
            ➕ Add Task
          </button>

        </div>

        <ul className="list-group">
          {filteredTasks.map((t, index) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={t._id}>
              
              {editId === t._id? (
                <div>

                  <input
                    className="form-control mb-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />

                  <select
                    className="form-select mb-1"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <select
                    className="form-select mb-1"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="">Select Priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>

                  <input
                    type="date"
                    className="form-control mb-1"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />

                </div>
              ) : (
                <span
                  
                >
                  <div>
                    <h6>{t.text}</h6>

                    <small>
                      Status:
                      <span className={
                        t.status === "Completed" ? "text-success" :
                        t.status === "In Progress" ? "text-primary" :
                        "text-warning"
                      }>
                        {" "}{t.status}
                      </span>
                    </small>

                    <br />

                    <small>
                      Priority:
                      <span className={
                        t.priority === "High" ? "text-danger" :
                        t.priority === "Medium" ? "text-warning" :
                        "text-success"
                      }>
                        {" "}{t.priority}
                      </span>
                    </small>

                    <br />

                    <small>
                      Due: {t.dueDate || "No date"}
                    </small>
                  </div>
                </span>
              )}

              <div>
                <button className="btn btn-sm btn-danger me-2" onClick={() => deleteTask(t._id)}>❌</button>

                <button className="btn btn-sm btn-warning me-2" onClick={() => {
                  setEditId(t._id);
                  setEditText(t.text);
                  setEditStatus(t.status);
                  setEditPriority(t.priority);
                  setEditDate(t.dueDate);
                }}
                
                >✏️</button>

                {editId === t._id&& (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      axios.put(`http://localhost:5000/tasks/edit/${t._id}`, {
                        text: editText,
                        status: editStatus,
                        priority: editPriority,
                        dueDate: editDate
                      })
                      .then((res) => {
                        setTasks(tasks.map((task) =>
                          task._id === res.data._id ? res.data : task
                        ));
                        setEditId(null);
                        
                      });
                    }}
                  >
                    💾
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
       {loading ? (
        <p>Loading tasks... ⏳</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-muted" >No tasks available</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks found 😴</p>
      ) : null}

      
        
      </div>
    </div>
  );
}

export default App;