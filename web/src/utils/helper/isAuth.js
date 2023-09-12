import { getFromStorage } from "./localStorage";

const isAuth = () => {
  if (getFromStorage({ name: "token" })) return true;
  return false;
};

export { isAuth };
