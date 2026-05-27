import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default RequireAuth;
