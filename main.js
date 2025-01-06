const API_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200?api_key=6fc939ab5b5d77a48382a65bd2c3188e";
let movies = [];

async function fetchMovies() {
  if (localStorage.getItem("movies")) {
    movies = JSON.parse(localStorage.getItem("movies"));
    displayMovies(movies);
    return;
  }
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZmM5MzlhYjViNWQ3N2E0ODM4MmE2NWJkMmMzMTg4ZSIsIm5iZiI6MTcyMjcxMTkwNS42OTkyMjgsInN1YiI6IjY2YWU3YjBiYmI5NzlkNmEyMDE3M2M4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6cRZJ8-Ogf5r3uWDIzlmveT6yIlJ4khnpMB3SJ1Tbpk",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    movies = data.results;
    console.log("Fetched movies:", movies);
    displayMovies(movies);
    localStorage.setItem("movies", JSON.stringify(movies));
  } catch (error) {
    console.error("Error fetching movies:", error);
    document.getElementById(
      "movie-container"
    ).innerHTML = `<p>Error loading movies. Please try again later.</p>`;
  }
}

function displayMovies(moviesToDisplay) {
  const movieContainer = document.getElementById("movie-container");
  movieContainer.innerHTML = "";

  if (moviesToDisplay.length === 0) {
    movieContainer.innerHTML = "<p>No movies to display.</p>";
    return;
  }

  moviesToDisplay.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieContainer.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";
  if (movie.backdrop_path) {
    card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }">
      <h3>${movie.title || "No Title"}</h3>
        <p>Release Date: ${movie.release_date || "Unknown"}</p>
        <p>overview: ${movie.overview || "Unknown"}</p>
        <button onclick="removeMovie(${movie.id})">Remove</button>
    `;
  } else {
    card.innerHTML = `
          <img src="${movie.poster_path} alt="${movie.title}">
          <h3>${movie.title || "No Title"}</h3>
        <p>Release Date: ${movie.release_date || "Unknown"}</p>
        <p>overview: ${movie.overview || "Unknown"}</p>
        <button onclick="removeMovie(${movie.id})">Remove</button>
    `;
  }

  return card;
}

function removeMovie(id) {
  movies = movies.filter((movie) => movie.id !== id);
  displayMovies(movies);
  localStorage.setItem("movies", JSON.stringify(movies));
}
function addMovie() {
  const poster_path = document.getElementById("image").value;
  const title = document.getElementById("movie-title").value;
  const release_date = document.getElementById("release-date").value;
  if (Number(release_date) < 1900 || Number(release_date) > 2024) {
    alert("Please enter a valid year between 1900 and 2024");
    return;
  }
  const overview = document.getElementById("overview").value;
  if (title && release_date && poster_path && overview) {
    const newMovie = {
      id: movies.length + 1,
      poster_path,
      title,
      release_date,
      overview,
    };

    movies.push(newMovie);
    displayMovies(movies);
    localStorage.setItem("movies", JSON.stringify(movies));
    form.reset();
    // Clear input fields
  }
}
function handleForm(event) {
  event.preventDefault();
  addMovie();
}
var form = document.getElementsByClassName("add-movie")[0];
form.addEventListener("submit", handleForm);

const searchInput = document.getElementById("search-input");
const autocompleteList = document.getElementById("autocomplete-list");

searchInput.addEventListener("input", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const matchingMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm)
  );
  displayMovies(matchingMovies);
  displayAutocomplete(matchingMovies);
}

function displayAutocomplete(matchingMovies) {
  autocompleteList.innerHTML = "";
  matchingMovies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title;
    li.addEventListener("click", () => {
      searchInput.value = movie.title;
      autocompleteList.innerHTML = "";
      displayMovies([movie]);
    });
    autocompleteList.appendChild(li);
  });
}

// Call fetchMovies when the page loads
document.addEventListener("DOMContentLoaded", fetchMovies);

console.log("Script loaded");
