import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const history = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user) {
    let msgText = "Successfully submited";
    let msgType = "success";
    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });
      await authUser(data);
    } catch (err) {
      msgText = err.response.data.message;
      msgType = "error";
    }
    setFlashMessage(msgText, msgType);
  }

  async function authUser(data) {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));
    history("/");
  }

  async function login(user) {
    let msgText = "Successfully logged";
    let msgType = "success";

    try {
      const data = await api.post("/users/login", user).then((response) => {
        return response.data;
      });
      await authUser(data);
    } catch (err) {
      msgText = err.response.data.message;
      msgType = "error";
    }
    setFlashMessage(msgText, msgType);
  }

  function logout() {
    const msgText = "Logout successful";
    const msgType = "success";

    setAuthenticated(false);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    history("/");
    setFlashMessage(msgText, msgType);
  }

  return { register, authenticated, logout, login };
}
