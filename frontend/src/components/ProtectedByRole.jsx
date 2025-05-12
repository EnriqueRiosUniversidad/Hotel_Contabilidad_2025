import { Navigate } from 'react-router-dom';
import { isTokenValid, getUserRole } from '../utils/auth';

export default function ProtectedByRole({ allowedRoles, children }) {
  if (!isTokenValid()) return <Navigate to="/login" />;

  const userRole = getUserRole();
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return children;
}
