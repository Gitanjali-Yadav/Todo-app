import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    if (task.trim() === "") return; // prevent empty tasks
    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const clearAll = () => {
    setTasks([]);
  };

  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === "active") {
      filtered = tasks.filter((t) => !t.completed);
    } else if (filter === "completed") {
      filtered = tasks.filter((t) => t.completed);
    }

    // Sorting
    if (sortOrder === "newest") {
      filtered = [...filtered].sort((a, b) => b.id - a.id);
    } else if (sortOrder === "oldest") {
      filtered = [...filtered].sort((a, b) => a.id - b.id);
    } else if (sortOrder === "incomplete-first") {
      filtered = [...filtered].sort((a, b) => a.completed - b.completed);
    } else if (sortOrder === "completed-first") {
      filtered = [...filtered].sort((a, b) => b.completed - a.completed);
    } else if (sortOrder === "a-z") {
      filtered = [...filtered].sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortOrder === "z-a") {
      filtered = [...filtered].sort((a, b) => b.text.localeCompare(a.text));
    }

    return filtered;
  };

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const finishEdit = (id) => {
    if (editingText.trim() === "") {
      setEditingId(null);
      return;
    }

    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editingText.trim() } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="App">
      <h1>ToDo App</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a Task"
      />
      <button className="primary-btn" onClick={handleAdd}>
        Add Task
      </button>

      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
          <option value="incomplete-first">Incomplete First</option>
          <option value="completed-first">Completed First</option>
        </select>
      </div>

     

      <ul>
        {getFilteredTasks().length === 0 ? (
          <li style={{ fontStyle: "italic", color: "#999" }}>No tasks Found</li>
        ) : (
          getFilteredTasks().map((t) => (
            <li key={t.id}>
              {editingId === t.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => finishEdit(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishEdit(t.id);
                  }}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => toggleComplete(t.id)}
                  onDoubleClick={() => startEdit(t)}
                  className={t.completed ? "completed" : ""}
                >
                  {t.text}
                </span>
              )}
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>✕</button>
            </li>
          ))
        )}
      </ul>

       <div className="clear-buttons" style={{ margin: "10px 0" }}>
        <button onClick={clearCompleted} className="secondary-btn" style={{ marginRight: "10px" }}>
          Clear Completed Tasks
        </button>
        <button onClick={clearAll} className="danger-btn">
          Clear All Tasks
        </button>
      </div>
    </div>
  );
}

export default App;
