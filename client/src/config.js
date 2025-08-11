const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://amazon-clone-backend-p4ol.onrender.com"
    : "http://localhost:8000";

export default API_BASE;
