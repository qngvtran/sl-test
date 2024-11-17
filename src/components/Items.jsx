import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/Items.css";

function Items({ listId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [resolvedTasks, setResolvedTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${listId}`));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, [listId]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks_${listId}`, JSON.stringify(tasks));
    } else {
      localStorage.removeItem(`tasks_${listId}`);
    }
  }, [tasks, listId]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function resolveTask(index) {
    const taskToResolve = tasks[index];
    setResolvedTasks((prev) => [...prev, taskToResolve]);
    deleteTask(index);
  }

  function unresolveTask(index) {
    const taskToUnresolve = resolvedTasks[index];
    setTasks((prev) => [...prev, taskToUnresolve]);
    const updatedResolvedTasks = resolvedTasks.filter((_, i) => i !== index);
    setResolvedTasks(updatedResolvedTasks);
  }

  function startEditing(index) {
    setEditIndex(index);
    setEditValue(tasks[index]);
  }

  function saveEdit() {
    if (editValue.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = editValue;
      setTasks(updatedTasks);
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditValue("");
  }

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  const filteredTasks = tasks.filter((task) =>
    task.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredResolvedTasks = resolvedTasks.filter((task) =>
    task.toLowerCase().includes(filter.toLowerCase())
  );

  function toggleFilterVisibility() {
    setIsFilterVisible(!isFilterVisible);
  }

  return (
    <div className="items">
      <h1>Items</h1>

      <div>
        <input
          className="II"
          type="text"
          placeholder="Enter an item..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          +
        </button>
      </div>

      <div>
        <button className="filter-toggle" onClick={toggleFilterVisibility}>
          Filter
        </button>
        {isFilterVisible && (
          <input
            type="text"
            placeholder="Search items..."
            value={filter}
            onChange={handleFilterChange}
          />
        )}
      </div>

      {tasks.length > 0 && (
        <>
          <h2>Active Items</h2>
          <ol>
            {filteredTasks.map((task, index) => (
              <li key={index}>
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button className="save-button" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text">{task}</span>
                    <button
                      className="resolve-button"
                      onClick={() => resolveTask(index)}
                    >
                      ✅
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => startEditing(index)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(index)}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      {filteredResolvedTasks.length > 0 && (
        <>
          <h2>Resolved Items</h2>
          <ol>
            {filteredResolvedTasks.map((task, index) => (
              <li key={index}>
                <span className="text resolved">{task}</span>
                <button
                  className="resolve-button"
                  onClick={() => unresolveTask(index)}
                >
                  Undo
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

Items.propTypes = {
  listId: PropTypes.string.isRequired,
};

export default Items;