// @flow
import React, { Component } from 'react';

import { UserSelectedState } from '../baskets/user';
import { TodoYield } from '../baskets/todo';
import { type TodoModel } from '../baskets/todo/types';

type TodoItemProps = {
  todo: TodoModel,
};

const TodoItem = ({ todo }: TodoItemProps) => (
  <li className="TodoItem">{todo.title}</li>
);

type TodoListProps = {
  selectedUser: ?string,
  todos: TodoModel[],
  loading: boolean,
  onLoad: (uid: string) => any,
};

class TodoList extends Component<TodoListProps> {
  componentDidUpdate(prevProps) {
    const { selectedUser, onLoad } = this.props;
    if (selectedUser && selectedUser !== prevProps.selectedUser) {
      onLoad(selectedUser);
    }
  }
  render() {
    const { todos, loading, selectedUser } = this.props;

    if (!selectedUser || loading) {
      return (
        <div className="TodoList">
          {loading ? 'Loading...' : 'Select a user first'}
        </div>
      );
    }

    return (
      <ul className="TodoList">
        {todos.map(todo => (
          <TodoItem key={todo.title} todo={todo} />
        ))}
      </ul>
    );
  }
}

const YieldedTodoList = () => (
  <UserSelectedState>
    {({ sel }) => (
      <TodoYield>
        {({ data, loading, load }) => (
          <TodoList
            todos={data || []}
            loading={loading}
            onLoad={load}
            selectedUser={sel}
          />
        )}
      </TodoYield>
    )}
  </UserSelectedState>
);

export default YieldedTodoList;
