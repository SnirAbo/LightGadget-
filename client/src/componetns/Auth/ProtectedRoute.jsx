/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';


const ProtectedRoute = ({  allowedRoles  }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const storedUser = sessionStorage.getItem('user');
  const userFromStorage = storedUser ? JSON.parse(storedUser) : null;

  const user = currentUser || userFromStorage;

  // אם אין משתמש בכלל — עף לדף התחברות
  if (!user) {
    return <Navigate to="/login" />;
  }

  // אם הוגדר תפקיד מורשה, והמשתמש לא תואם — עף גם כן
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Not allowed!");
    return <Navigate to="/account" />;
  }

  // אחרת — הכל טוב
  return <Outlet />;
};

export default ProtectedRoute;
