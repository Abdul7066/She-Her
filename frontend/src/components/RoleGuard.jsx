import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ allowedRoles, children, redirectPath = '/login' }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  // If there's no user, or their role is not explicitly within the allowed array, do not compile the children.
  if (!userInfo) {
     return <Navigate to={redirectPath} replace />;
  }

  // Gracefully fallback to 'customer' if for some edge-case reason their role enum is missing.
  const userRole = userInfo.role || 'customer';

  if (!allowedRoles.includes(userRole)) {
     // If wrapped around an inline component like a Button, we just return null rather than redirecting
     // so the Button quietly disappears cleanly instead of breaking the entire route.
     return null; 
  }

  return children;
};

export default RoleGuard;
