import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'nimble-todos';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt: number | null;
  createdAt: number;
}

function loadTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TodoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
  const [newTodoText, setNewTodoText] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const activeTodos = todos.filter((t) => !t.completed);
  const recentlyCompleted = todos
    .filter(
      (t) =>
        t.completed &&
        t.completedAt !== null &&
        Date.now() - t.completedAt < SEVEN_DAYS_MS
    )
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      completedAt: null,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        const completed = !todo.completed;
        return {
          ...todo,
          completed,
          completedAt: completed ? Date.now() : null,
        };
      })
    );
  };

  const reorderActiveTodos = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setTodos((prev) => {
      const active = prev.filter((t) => !t.completed);
      const completed = prev.filter((t) => t.completed);
      const reordered = [...active];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      return [...reordered, ...completed];
    });
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    reorderActiveTodos(dragIndex, index);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const formatCompletedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="todo-list-tool">
      <header className="tool-header">
        <h1>To-Do List</h1>
        <p>Track tasks, set priority by drag-and-drop, and review recent completions</p>
      </header>

      <main className="tool-main">
        <div className="input-section todo-input-section">
          <form onSubmit={addTodo} className="todo-add-form">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="todo-text-input"
              aria-label="New task"
            />
            <button type="submit" className="calculate-button" disabled={!newTodoText.trim()}>
              Add
            </button>
          </form>
        </div>

        <div className="results-section todo-list-section">
          <h2>Tasks</h2>
          {activeTodos.length === 0 ? (
            <p className="todo-empty">No active tasks. Add one above.</p>
          ) : (
            <ul className="todo-list">
              {activeTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className={`todo-item${dragIndex === index ? ' todo-item-dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="todo-drag-handle" aria-hidden="true" title="Drag to reorder">
                    ⋮⋮
                  </span>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                    aria-label={`Mark "${todo.text}" as done`}
                  />
                  <span className="todo-text">{todo.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {recentlyCompleted.length > 0 && (
          <div className="results-section todo-completed-section">
            <button
              type="button"
              className="todo-completed-toggle"
              onClick={() => setCompletedExpanded((prev) => !prev)}
              aria-expanded={completedExpanded}
            >
              <span className="todo-completed-chevron">{completedExpanded ? '▼' : '▶'}</span>
              Completed in the last 7 days ({recentlyCompleted.length})
            </button>
            {completedExpanded && (
              <ul className="todo-list todo-completed-list">
                {recentlyCompleted.map((todo) => (
                  <li key={todo.id} className="todo-item todo-item-completed">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                      aria-label={`Mark "${todo.text}" as not done`}
                    />
                    <span className="todo-text todo-text-completed">{todo.text}</span>
                    {todo.completedAt !== null && (
                      <span className="todo-completed-date">
                        {formatCompletedDate(todo.completedAt)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default TodoList;
