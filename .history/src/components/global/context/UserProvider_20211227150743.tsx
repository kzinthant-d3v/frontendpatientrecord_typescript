import React, { createContext } from 'react';

type User = 'admin' | 'casher';

export interface Iuser {
  user: {
    name: string;
    type: string;
  }
}

export const UserContext = createContext<Iuser>({
  name: '',
  type: '',
});

function UserProvider({ children }: {children: JSX.Element}):JSX.Element {
  const [user, setUser] = React.useState<Iuser>({
    name: '',
    type: '',
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;