import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoginPopup } from "../components";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication }) {
  // useNavigate is a hook from react-router-dom
  // It gives you a function to programmatically navigate (redirect) the user
  const navigate = useNavigate();

  // useSelector is a hook from react-redux
  // It allows you to access a value from the Redux store's state
  // Here, we get the current authentication status of the user
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // This effect runs when authStatus or authentication changes
    // Currently it's a placeholder that does nothing unless you want to add redirects later

    // If authentication is required and the user is not authenticated,
    // we can redirect them or show a login popup
    if (!authentication && authStatus !== authentication) {
      return;
    }
  }, [authStatus, authentication, navigate]);

  // If this page requires authentication (authentication === true), and the current auth status is not authenticated,
  // then show a <LoginPopup /> and stop rendering the rest of the component
  if (authentication && authStatus !== authentication) {
    return <LoginPopup />;
  }

  // Otherwise render the child components (page content)
  return children;
}

export default AuthLayout;
