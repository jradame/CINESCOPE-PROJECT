document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '2318418c';
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const typeSelect = document.getElementById('typeSelect');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  const moviesGrid = document.getElementById('moviesGrid');
  const seriesGrid = document.getElementById('seriesGrid');
  const gamesGrid = document.getElementById('gamesGrid');
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.close');

  const collage = document.getElementById('collage'); // ⬅️ Collage container for navbar

  // === Theme toggle ===
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    if (body.classList.toggle('light')) {
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    } else {
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  });

  // === Search functionality ===
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    const t = typeSelect.value;
    if (q) performSearch(q);
  });

  async function searchByType(query, type) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.Response === 'True' ? data.Search : [];
  }

  function clearGrids() {
    moviesGrid.innerHTML = '';
    seriesGrid.innerHTML = '';
    gamesGrid.innerHTML = '';
  }

  async function performSearch(query) {
    clearGrids();
    const [movies, series, games] = await Promise.all([
      searchByType(query, 'movie'),
      searchByType(query, 'series'),
      searchByType(query, 'game')
    ]);
    renderCards(movies, moviesGrid);
    renderCards(series, seriesGrid);
    renderCards(games, gamesGrid);
  }

  function renderCards(items, container) {
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      setTimeout(() => card.style.opacity = 1, 100);
      card.innerHTML = `
        <img src="${item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/160x240'}" alt="${item.Title}">
        <div class="card-info">
          <h3>${item.Title}</h3>
          <p>${item.Year}</p>
        </div>
      `;
      card.onclick = () => loadDetails(item.imdbID);
      container.appendChild(card);
    });
  }

  async function loadDetails(id) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
    const d = await res.json();
    modalDetails.innerHTML = `
      <div class="modal-details">
        <img src="${d.Poster !== 'N/A' ? d.Poster : ''}" alt="${d.Title}">
        <h2>${d.Title} (${d.Year})</h2>
        <p><strong>Genre:</strong> ${d.Genre}</p>
        <p><strong>Rating:</strong> ${d.imdbRating}</p>
        <p>${d.Plot}</p>
      </div>
    `;
    modal.classList.add('show');
  }

  closeBtn.onclick = () => modal.classList.remove('show');
  window.addEventListener('click', e => e.target === modal && modal.classList.remove('show'));

  // === Top content on Home ===
  const topMovies = ["Dune", "Oppenheimer", "Barbie", "John Wick", "Spider-Man"];
  const topShows = ["Stranger Things", "Breaking Bad", "Loki", "The Boys", "The Mandalorian"];
  const topGames = ["The Witcher 3", "Cyberpunk 2077", "Halo", "Zelda", "Final Fantasy"];

  async function renderTopList(titles, type, container) {
    let count = 0;
    for (let title of titles) {
      if (count >= 5) break;
      const results = await searchByType(title, type);
      if (results.length > 0) {
        renderCards([results[0]], container);
        count++;
      }
    }
  }

  async function initTopContent() {
    clearGrids();
    await Promise.all([
      renderTopList(topMovies, 'movie', moviesGrid),
      renderTopList(topShows, 'series', seriesGrid),
      renderTopList(topGames, 'game', gamesGrid)
    ]);
  }

  document.getElementById('homeBtn').addEventListener('click', e => {
    e.preventDefault();
    initTopContent();
    input.value = '';
  });

  // === Contact Modal ===
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const contactClose = document.querySelector('.contact-close');
  const thankYouModal = document.getElementById('thankYouModal');

  contactBtn.addEventListener('click', e => {
    e.preventDefault();
    contactModal.classList.add('show');
  });
  contactClose.onclick = () => contactModal.classList.remove('show');
  window.addEventListener('click', e => {
    if (e.target === contactModal) contactModal.classList.remove('show');
  });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    contactModal.classList.remove('show');
    thankYouModal.classList.add('show');
    setTimeout(() => thankYouModal.classList.remove('show'), 3000);
  });

  // === Load poster collage for navbar ===
  async function loadNavbarPosters() {
    const keywords = ['avengers', 'batman', 'matrix', 'harry potter', 'lotr'];
    for (let keyword of keywords) {
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(keyword)}&type=movie`);
        const data = await res.json();
        if (data.Search) {
          data.Search.slice(0, 2).forEach(movie => {
            if (movie.Poster && movie.Poster !== 'N/A') {
              const img = document.createElement('img');
              img.src = movie.Poster;
              img.alt = movie.Title;
              collage.appendChild(img);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load collage posters:', error);
      }
    }
  }

  // === Init app ===
  initTopContent();
  loadNavbarPosters();
});


