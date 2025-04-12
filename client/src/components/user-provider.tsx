import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContextType, UserProviderType } from '../types';


const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {} 
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProviderType | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (localStorage.getItem('authToken')) {
      fetchProfile();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
