// All API calls live here. Change API_URL if your JSON Server uses another address.
const API_URL = "http://localhost:3000";

const send = async (path, method, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};

const get = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};

// Movies
export const getMovies = () => get("/movies");
export const getMovieById = (id) => get(`/movies/${id}`);
export const updateMovie = (id, movie) => send(`/movies/${id}`, "PUT", movie);

// Reviews
export const getReviews = () => get("/reviews");
export const addReview = (review) => send("/reviews", "POST", review);
