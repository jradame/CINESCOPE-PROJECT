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
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const contactClose = document.querySelector('.contact-close');

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

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) performSearch(q);
  });

  async function searchByType(query, type) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.Response === 'True' ? data.Search.slice(0, 5) : [];
  }

  function renderCards(items, container) {
    container.innerHTML = '';
    items.slice(0, 5).forEach(item => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/160x240'}" alt="${item.Title}">
        <div class="card-info">
          <h3>${item.Title}</h3>
          <p>${item.Year}</p>
        </div>`;
      card.onclick = () => loadDetails(item.imdbID);
      container.appendChild(card);
    });
  }

  async function performSearch(query) {
    const [movies, series, games] = await Promise.all([
      searchByType(query, 'movie'),
      searchByType(query, 'series'),
      searchByType(query, 'game')
    ]);
    renderCards(movies, moviesGrid);
    renderCards(series, seriesGrid);
    renderCards(games, gamesGrid);
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
      </div>`;
    modal.classList.add('show');
  }

  closeBtn.onclick = () => modal.classList.remove('show');
  window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

  const topMovies = ["Dune", "Oppenheimer", "Barbie", "John Wick", "Spider-Man"];
  const topShows = ["Stranger Things", "Breaking Bad", "Loki", "The Boys", "The Mandalorian"];
  const topGames = ["Grand Theft Auto V", "Cyberpunk 2077", "Halo", "Zelda", "Final Fantasy"];

  async function initTopContent() {
    const [movies, shows, games] = await Promise.all([
      Promise.all(topMovies.map(t => searchByType(t, 'movie').then(r => r[0] || null))),
      Promise.all(topShows.map(t => searchByType(t, 'series').then(r => r[0] || null))),
      Promise.all(topGames.map(t => searchByType(t, 'game').then(r => r[0] || null)))
    ]);
    renderCards(movies.filter(Boolean), moviesGrid);
    renderCards(shows.filter(Boolean), seriesGrid);
    renderCards(games.filter(Boolean), gamesGrid);
  }

  document.getElementById('homeBtn').addEventListener('click', e => {
    e.preventDefault();
    input.value = '';
    initTopContent();
  });

  contactBtn.addEventListener('click', e => {
    e.preventDefault();
    contactModal.classList.add('show');
  });
  contactClose.onclick = () => contactModal.classList.remove('show');
  window.addEventListener('click', e => { if (e.target === contactModal) contactModal.classList.remove('show'); });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    contactModal.classList.remove('show');
    alert('Thanks for reaching out!');
  });

  initTopContent();
});








