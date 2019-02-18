// @flow
import React from 'react';

import { UserContainer, UserSubscriber } from '../baskets/user';
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
  onSelect: (id: string) => any,
};

const UserList = ({ users, selected, loading, onSelect }: UserListProps) =>
  loading ? (
    <div className="UserList">Loading...</div>
  ) : (
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

const SubscribedUserList = () => (
  <UserContainer isGlobal>
    <UserSubscriber>
      {({ data, loading, selected }, { select, load }) => (
        <UserList
          users={data || []}
          loading={loading}
          selected={selected}
          onSelect={select}
          onLoad={load}
        />
      )}
    </UserSubscriber>
  </UserContainer>
);

export default SubscribedUserList;
