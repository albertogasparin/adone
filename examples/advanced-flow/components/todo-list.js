// @flow
import React from 'react';

import { UserSelectedSubscriber } from '../baskets/user';
import { TodoContainer, TodoSubscriber } from '../baskets/todo';
import { type TodoModel } from '../baskets/todo/types';

type TodoItemProps = {
  todo: TodoModel,
};

const TodoItem = ({ todo }: TodoItemProps) => (
  <li className="TodoItem">{todo.title}</li>
);

type TodoListProps = {
  selectedUser: ?string,
  todos: TodoModel[] | null,
  loading: boolean,
};

const TodoList = ({ todos, loading, selectedUser }: TodoListProps) =>
  !selectedUser || !todos || loading ? (
    <div className="TodoList">
      {loading ? 'Loading...' : 'Select a user first'}
    </div>
  ) : (
    <ul className="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.title} todo={todo} />
      ))}
    </ul>
  );

const SubscribedTodoList = () => (
  <UserSelectedSubscriber>
    {({ sel }) => (
      <TodoContainer selectedUser={sel}>
        <TodoSubscriber>
          {({ data, loading }) => (
            <TodoList todos={data} loading={loading} selectedUser={sel} />
          )}
        </TodoSubscriber>
      </TodoContainer>
    )}
  </UserSelectedSubscriber>
);

export default SubscribedTodoList;
