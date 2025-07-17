import React, { useEffect, useState } from 'react';
import AdminEventsPage from './AdminEventsPage';
import LeaderEventsPage from './LeaderEventsPage';
import PlayerEventsPage from './PlayerEventsPage';

const EventPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
      setUserRole(userInfo.role.name || 'player');
    }
  }, []);

  // Render component dựa trên role
  const renderComponentByRole = () => {
    switch (userRole) {
      case 'admin':
        return <AdminEventsPage />;
      case 'leader':
        return <LeaderEventsPage />;
      case 'player':
      default:
        return <PlayerEventsPage />;
    }
  };

  return renderComponentByRole();
};

export default EventPage;
