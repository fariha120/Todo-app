
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [level, setLevel] = useState(1);
  const [badge, setBadge] = useState("");

  useEffect(() => {
    localStorage.setItem("points", points); // Save points in localStorage
    setLevel(Math.floor(points / 50) + 1); // Level up every 50 points

    // Award badges
    if (points >= 100) setBadge("Task Master");
    else if (points >= 50) setBadge("Rising Star");
    else setBadge("");
  }, [points]);

  const addTask = (title, difficulty) => {
    const newTask = { id: Date.now(), title, difficulty, completed: false };
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id, difficulty) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: true } : task));
    setPoints(points + difficulty);
  };

  return (
    <div className="App">
      <header>
        <h1>Gamified To-Do List</h1>
        <p>Points: {points} | Level: {level}</p>
        {badge && <p className="badge">🏆 {badge}</p>}
      </header>

      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} completeTask={completeTask} />
    </div>
  );
};

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(10);

  const handleSubmit = e => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title, parseInt(difficulty));
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value={10}>Easy (10 points)</option>
        <option value={20}>Medium (20 points)</option>
        <option value={30}>Hard (30 points)</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskList = ({ tasks, completeTask }) => {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={task.completed ? "completed" : ""}>
          <span>{task.title}</span>
          {!task.completed && (
            <button onClick={() => completeTask(task.id, task.difficulty)}>
              Complete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default App;
