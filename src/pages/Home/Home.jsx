import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Movie Portal</h1>
      <p>Browse movies, read details and share your own rating.</p>

      <Link to="/movies">
        <button>Explore Movies</button>
      </Link>
    </div>
  );
}

export default Home;
