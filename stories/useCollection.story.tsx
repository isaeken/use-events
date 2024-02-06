import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { IModel } from '../src/types';
import { EventsContextProvider, useEvents } from '../src/contexts/EventsContext';

interface User extends IModel {
  name: string;
  email: string;
}

const Demo = () => {
  const users = useEvents().useCollection<User>('users');

  return (
    <div>
      <button
        onClick={() => {
          users.create({
            id: users.rows.reduce((acc, row) => Math.max(acc, row.id), 0) + 1,
            name: 'Test',
            email: 'asd@asd.com',
          });
        }}>
        Create
      </button>
      <button
        onClick={() => {
          users
            .withTrashed()
            .with(['asd', 'qwe'])
            .limit(20)
            .where('name', 'like', 'test')
            .orWhere('email', 'in', ['asd', 'qwe'])
            .orderBy('name', 'desc')
            .count();
        }}>
        get
      </button>

      <br/>
      <br/>

      <div>
        {users.rows.map((row) => (
          <div key={row.id} style={{padding: 10}}>
            <button
              onClick={() => {
                users.update(row.id, {
                  name: 'Test 2',
                });
              }}>
              Update
            </button>
            <button
              onClick={() => {
                users.destroy(row);
              }}>
              Destroy
            </button>
            <br/>
            <div>{JSON.stringify(row)}</div>
          </div>
        ))}
      </div>
      {JSON.stringify(users.rows)}
    </div>
  );
};

storiesOf('State/useToggle', module).add('Demo', () => (
  <EventsContextProvider>
    <Demo/>
  </EventsContextProvider>
));
