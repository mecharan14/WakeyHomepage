import React from 'react';

interface Todo {
  id: number;
  title: string;
}

interface TodosProps {
  todos: Todo[];
  addTodo: () => void;
  delTodo: (id: number) => void;
}

const Todos: React.FC<TodosProps> = ({ todos, addTodo, delTodo }) => {
  return (
    <div className="container" style={{ minHeight: '20vh', display: 'block' }}>
      <h2 style={{ fontWeight: 500 }}>To-do</h2>
      <div className="todos" style={{ marginTop: "16px" }}>
        {todos.length > 0 ? (
          todos.map(todo => (
            <div key={todo.id} className="todoItem">{todo.title} <button onClick={() => delTodo(todo.id)}>-</button></div>
          ))
        ) : (
          <p style={{ color: "grey" }}>Empty</p>
        )}
      </div>
      <br /><br />
      <button className="btn" style={{ background: 'linear-gradient(to right, #1f4037, #99f2c8)' }} onClick={addTodo}>Add Todo</button>
    </div>
  );
};

export default Todos;
