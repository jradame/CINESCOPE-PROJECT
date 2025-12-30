document.addEventListener("DOMContentLoaded", () => {
  const TMDB_KEY = "c165c5525a08be3bc96af59600aaf011";
  const TMDB_BASE = "https://api.themoviedb.org/3";
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";
  const PLACEHOLDER = "https://dummyimage.com/160x240/2e2e2e/ffffff&text=No+Image";


  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const typeSelect = document.getElementById("typeSelect");

  const moviesGrid = document.getElementById("moviesGrid");
  const seriesGrid = document.getElementById("seriesGrid");
  const gamesGrid = document.getElementById("gamesGrid"); // Will remain empty for now

  const modal = document.getElementById("modal");
  const modalDetails = document.getElementById("modalDetails");
  const closeBtn = document.querySelector(".close");

  async function tmdbSearch(query, type) {
    const url = `${TMDB_BASE}/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  }

  function clearGrids() {
    moviesGrid.innerHTML = "";
    seriesGrid.innerHTML = "";
    gamesGrid.innerHTML = "";
  }

  function createCard(item, container, type) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const img = document.createElement("img");
    img.src = item.poster_path ? `${IMG_BASE}${item.poster_path}` : PLACEHOLDER;
    img.alt = item.title || item.name || "Poster";

    const info = document.createElement("div");
    info.className = "card-info";
    info.innerHTML = `
      <h3>${item.title || item.name}</h3>
      <p>${item.release_date || item.first_air_date || ""}</p>`;

    card.appendChild(img);
    card.appendChild(info);

    card.onclick = () => loadDetails(item.id, type);

    container.appendChild(card);
  }

  async function loadDetails(id, type) {
    const url = `${TMDB_BASE}/${type}/${id}?api_key=${TMDB_KEY}&append_to_response=videos,images`;
    const res = await fetch(url);
    const data = await res.json();

    modalDetails.innerHTML = "";
    const container = document.createElement("div");
    container.className = "modal-details";

    const img = document.createElement("img");
    img.src = data.poster_path ? `${IMG_BASE}${data.poster_path}` : PLACEHOLDER;
    img.alt = data.title || data.name;

    const title = document.createElement("h2");
    title.textContent = `${data.title || data.name} (${(data.release_date || data.first_air_date || "").slice(0, 4)})`;

    const genre = document.createElement("p");
    genre.innerHTML = `<strong>Genre:</strong> ${data.genres.map(g => g.name).join(", ")}`;

    const rating = document.createElement("p");
    rating.innerHTML = `<strong>Rating:</strong> ${data.vote_average || "N/A"}`;

    const plot = document.createElement("p");
    plot.textContent = data.overview || "No overview available.";

    container.appendChild(img);
    container.appendChild(title);
    container.appendChild(genre);
    container.appendChild(rating);
    container.appendChild(plot);

    modalDetails.appendChild(container);
    modal.classList.add("show");
  }

  closeBtn.onclick = () => modal.classList.remove("show");

  form.onsubmit = async (e) => {
    e.preventDefault();
    clearGrids();

    const query = input.value.trim();
    if (!query) return;

    const type = typeSelect.value;
    if (type === "movie") {
      const movies = await tmdbSearch(query, "movie");
      movies.forEach(m => createCard(m, moviesGrid, "movie"));
    } else if (type === "series") {
      const series = await tmdbSearch(query, "tv");
      series.forEach(s => createCard(s, seriesGrid, "tv"));
    } else {
      gamesGrid.innerHTML = `<div class="movie-card">
        <img src="${PLACEHOLDER}" alt="Games not supported">
        <div class="card-info"><h3>Game support coming soon</h3></div>
      </div>`;
    }
  };

  // Optional: Load demo content on startup
  const topMovies = ["Dune", "Oppenheimer", "Barbie", "John Wick", "Spider-Man"];
  const topShows = ["Stranger Things", "Breaking Bad", "Loki", "The Boys", "The Mandalorian"];

  async function loadTop(titles, type, container) {
    for (const title of titles) {
      const results = await tmdbSearch(title, type);
      if (results.length) createCard(results[0], container, type);
    }
  }

  function initTop() {
    loadTop(topMovies, "movie", moviesGrid);
    loadTop(topShows, "tv", seriesGrid);
    gamesGrid.innerHTML = `<div class="movie-card">
      <img src="${PLACEHOLDER}" alt="Games">
      <div class="card-info"><h3>Games coming soon</h3></div>
    </div>`;
  }

  initTop();
});
