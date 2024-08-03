import { useState, useCallback } from 'react';
import { SERVER_DOMAIN } from '../helper/constants';
const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState(null);

  const createUser = useCallback(async (refId, beraAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SERVER_DOMAIN}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refId, address: beraAddress }),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      const userData = await response.json();
      setNewUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error, newUser };
};

export default useCreateUser;
