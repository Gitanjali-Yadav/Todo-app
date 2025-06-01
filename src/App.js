import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  // State for the new task input field
  const [task, setTask] = useState("");

  // State for list of tasks, initialized from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Adds a new task to the task list
  const handleAdd = () => {
    if (task.trim() === "") return; // prevent adding empty tasks

    // Create a new task object with unique id and default completed = false
    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };

    // Add the new task to tasks array and reset input field
    setTasks([...tasks, newTask]);
    setTask("");
  };

  // Toggles the completion status of a task by id
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Deletes a task by id
  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Clears all tasks that are marked completed
  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  // Clears all tasks regardless of status
  const clearAll = () => {
    setTasks([]);
  };

  // State to control filtering: "all", "active", or "completed"
  const [filter, setFilter] = useState("all");

  // State to control sorting order
  const [sortOrder, setSortOrder] = useState("newest");

  // Returns tasks filtered and sorted based on current filter and sortOrder state
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter tasks based on completion status
    if (filter === "active") {
      filtered = tasks.filter((t) => !t.completed);
    } else if (filter === "completed") {
      filtered = tasks.filter((t) => t.completed);
    }

    // Sort filtered tasks based on sortOrder
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

  // State to track which task is currently being edited
  const [editingId, setEditingId] = useState(null);

  // State for the current text in the editing input field
  const [editingText, setEditingText] = useState("");

  // Start editing a task: set editingId and prefill input with existing task text
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  // Finish editing a task and update tasks list
  const finishEdit = (id) => {
    if (editingText.trim() === "") {
      // If edited text is empty, cancel editing without changes
      setEditingId(null);
      return;
    }

    // Update the task text and reset editing state
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

      {/* Input for new task */}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a Task"
      />

      {/* Button to add new task */}
      <button className="primary-btn" onClick={handleAdd}>
        Add Task
      </button>

      {/* Controls for filtering and sorting tasks */}
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

      {/* Display list of tasks or message if none */}
      <ul>
        {getFilteredTasks().length === 0 ? (
          <li style={{ fontStyle: "italic", color: "#999" }}>No tasks Found</li>
        ) : (
          getFilteredTasks().map((t) => (
            <li key={t.id}>
              {/* If task is being edited, show input box */}
              {editingId === t.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => finishEdit(t.id)} // finish edit when input loses focus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finishEdit(t.id); // finish edit on Enter key
                  }}
                  autoFocus
                />
              ) : (
                // Otherwise, show the task text with click handlers
                <span
                  onClick={() => toggleComplete(t.id)} // toggle complete on single click
                  onDoubleClick={() => startEdit(t)} // start editing on double click
                  className={t.completed ? "completed" : ""}
                >
                  {t.text}
                </span>
              )}
              {/* Delete task button */}
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>✕</button>
            </li>
          ))
        )}
      </ul>

      {/* Buttons to clear completed tasks or clear all tasks */}
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
