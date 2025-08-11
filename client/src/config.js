const API_BASE =
  process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.length
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8000";

export default API_BASE;
