import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import CONSTANTS from "../constants";

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  onLogin: (email, password) => {},
  onLogout: () => {},
  onTokenChange: (token) => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    _id: "",
    name: "",
  });
  const [gettingAuth, setGettingAuth] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      // console.log("token",token)
      try {
        const tokenRes = await axios.post(
          CONSTANTS.BASE_URL + "api/tokenIsValid",
          null,
          { headers: { "x-auth-token": token } }
        );

        if (tokenRes.data.value) {
          setIsLoggedIn(true);
          let user = jwt_decode(token);
          setUser(user);
          setGettingAuth(false);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        setGettingAuth(false);
        navigate("/login", { replace: true });
      }
    };
    checkLoggedIn();
  }, []);

  const logoutHandler = () => {
    localStorage.setItem("auth-token", "");
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleTokenChange = (token) => {
    localStorage.setItem("auth-token", token);
    setIsLoggedIn(true);
    let user = jwt_decode(token);
    setUser(user);
  };
  const loginHandler = (email, password) => {
    return new Promise(async (resolve, reject) => {
      let url = "api/login";
      let data = {
        email: email,
        password: password,
      };
      await axios
        .post(CONSTANTS.BASE_URL + url, data)
        .then((response) => {
          localStorage.setItem("auth-token", response.data.token);
          setIsLoggedIn(true);
          let user = jwt_decode(response.data.token);
          setUser(user);

          resolve({ err: false, user: user });
        })
        .catch((err) => {
          reject({ error: true });
        });
    });
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        user: user,
        onLogin: loginHandler,
        onLogout: logoutHandler,
        onTokenChange: handleTokenChange,
      }}
    >
      {!gettingAuth && props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
