import { useState } from "react";

// const todoData = [
//   {
//     id: 1,
//     category: "Personal",
//     description: "Start the day with a workout routine",
//     done: true,
//   },
//   {
//     id: 2,
//     category: "Personal",
//     description: "Learn a few words in a foreign language",
//     done: false,
//   },
//   {
//     id: 3,
//     category: "Work",
//     description: "Participate in the daily meeting with the team",
//     done: false,
//   },
//   {
//     id: 4,
//     category: "Work",
//     description: "Prepare a project presentation to the client",
//     done: false,
//   },
// ];

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleDone(id) {
    setItems((itmes) =>
      itmes.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function handleDeleteAll() {
    setItems([]);
  }

  return (
    <div className="container">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <TodoLists
        todoDatas={items}
        onDeleteItems={handleDeleteItem}
        onDone={handleDone}
        onDeleteAll={handleDeleteAll}
      />
      <Footer todos={items} />
    </div>
  );
}

function Logo() {
  return (
    <header className="header">
      <h1>Todo App</h1>
    </header>
  );
}

function Form({ onAddItems }) {
  const [category, setCategory] = useState("Personal");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItems = {
      category,
      description,
      done: false,
      id: Date.now(),
    };

    onAddItems(newItems);
    console.log(newItems);
    setCategory("Personal");
    setDescription("");
  }

  return (
    <div className="form-cont">
      <form className="form" onSubmit={handleSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Health">Health</option>
          <option value="Finance">Finance</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          maxLength="50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button>Add</button>
      </form>
    </div>
  );
}

function TodoLists({ todoDatas, onDeleteItems, onDone, onDeleteAll }) {
  const [sortBy, setSortBy] = useState("input");
  let listsDatas;

  if (sortBy === "input") listsDatas = todoDatas.slice();

  if (sortBy === "completed")
    listsDatas = todoDatas
      .slice()
      .sort((a, b) => Number(b.done) - Number(a.done));

  if (sortBy === "category")
    listsDatas = todoDatas
      .slice()
      .sort((a, b) => a.category.localeCompare(b.category));
  return (
    <div className="lists-box">
      <ul className="lists">
        {listsDatas.map((list) => (
          <List
            todos={list}
            onDeleteItems={onDeleteItems}
            onDone={onDone}
            key={list.id}
          />
        ))}
      </ul>

      <div className="action">
        <p>Sort by</p>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Input</option>
          <option value="completed">Completed</option>
          <option value="category">Category</option>
        </select>
        <button onClick={onDeleteAll}>Clear</button>
      </div>
    </div>
  );
}

function List({ todos, onDeleteItems, onDone }) {
  return (
    <>
      <li className={`list ${todos.done ? "done" : ""}`}>
        <div className="list-cont">
          <h5 className={`list-header ${todos.done ? "done" : ""}`}>
            {todos.category}
          </h5>
          <input
            type="checkbox"
            className="check"
            onClick={() => onDone(todos.id)}
          />
          <span className="list-close" onClick={() => onDeleteItems(todos.id)}>
            &times;
          </span>
        </div>
        <p className="list-description">{todos.description}</p>
      </li>
    </>
  );
}

function Footer({ todos }) {
  const numItems = todos.length;
  const numCompleted = todos.filter((todo) => todo.done).length;
  const numPercentage = Math.round((numCompleted / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {numItems > 0
          ? `You have ${numItems} items in your list. You have ${numCompleted}
        completed (${numPercentage}%)`
          : `Start adding to your list`}
      </em>
    </footer>
  );
}
