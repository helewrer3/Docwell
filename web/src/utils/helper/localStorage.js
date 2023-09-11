const saveToStorage = ({ name, data }) => {
  localStorage.setItem(name, JSON.stringify(data));
};

const getFromStorage = ({ name }) => {
  return JSON.parse(localStorage.getItem(name));
};

const deleteFromStorage = ({ name }) => {
  localStorage.removeItem(name);
};

export { saveToStorage, getFromStorage, deleteFromStorage };
