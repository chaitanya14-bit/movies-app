// FIXED for Vercel - works locally + live
import dbData from "../../db.json"; // <-- if error, change to "../db.json" or "./db.json" based on where your db.json is

const API_URL = "http://localhost:3000";
const isProduction = import.meta.env.PROD;

const send = async (path, method, body) => {
  if (isProduction) {
    // On Vercel, we can't POST to json-server, so simulate success
    console.log("Production mode: Simulating", method, path, body);
    return body;
  }
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};

const get = async (path) => {
  // On Vercel, return data from local db.json
  if (isProduction) {
    if (path.startsWith("/movies")) {
      const id = path.split("/")[2];
      if (id) {
        return dbData.movies.find(m => String(m.id) === String(id));
      }
      return dbData.movies;
    }
    if (path.startsWith("/reviews")) {
      // Get reviews from localStorage if added, else from db.json
      const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      return [...(dbData.reviews || []), ...localReviews];
    }
    return [];
  }

  // Local development - use json-server as before
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
export const addReview = (review) => {
  if (isProduction) {
    const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const newReview = { ...review, id: Date.now() };
    localReviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(localReviews));
    return Promise.resolve(newReview);
  }
  return send("/reviews", "POST", review);
};