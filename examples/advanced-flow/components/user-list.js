// @flow
import React, { Component } from 'react';

import { UserYield } from '../baskets/user';
import { type UserModel } from '../baskets/user/types';

type UserItemProps = {
  user: UserModel,
  isSelected: boolean,
  onClick: () => any,
};

const UserItem = ({ user, isSelected, onClick }: UserItemProps) => (
  <li
    className={'UserItem ' + (isSelected ? 'isSelected' : '')}
    onClick={onClick}
  >
    {user.name}
  </li>
);

type UserListProps = {
  users: UserModel[],
  loading: boolean,
  selected: string | null,
  onLoad: () => any,
  onSelect: (id: string) => any,
};

class UserList extends Component<UserListProps> {
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    const { users, selected, loading, onSelect } = this.props;
    if (loading) return <div className="UserList">Loading...</div>;
    return (
      <ul className="UserList">
        {users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            isSelected={user.id === selected}
            onClick={() => onSelect(user.id)}
          />
        ))}
      </ul>
    );
  }
}

const YieldedUserList = () => (
  <UserYield>
    {({ data, loading, selected, select, load }) => (
      <UserList
        users={data || []}
        loading={loading}
        selected={selected}
        onSelect={select}
        onLoad={load}
      />
    )}
  </UserYield>
);

export default YieldedUserList;
