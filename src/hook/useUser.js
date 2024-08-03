import { useState, useEffect, useCallback } from 'react';
import { SERVER_DOMAIN } from '../helper/constants';

const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiGetUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_DOMAIN}/api/v1/users/${userId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      apiGetUser();
    }
  }, [userId, apiGetUser]);

  return { user, loading, error };
};

export default useUser;
