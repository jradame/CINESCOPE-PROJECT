// 🎬 CineScope JS – All-in-one Search & Modal Logic


document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '2318418c';

  // DOM references
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const typeSelect = document.getElementById('typeSelect');
  const moviesGrid = document.getElementById('moviesGrid');
  const seriesGrid = document.getElementById('seriesGrid');
  const gamesGrid = document.getElementById('gamesGrid');
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modalDetails');
  const closeBtn = document.querySelector('.close');
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const contactClose = document.querySelector('.contact-close');
  const contactForm = document.getElementById('contactForm');
  const thankYouModal = document.getElementById('thankYouModal');
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutModal = document.getElementById('aboutModal');
  const aboutClose = document.querySelector('.about-close');

  // ⬇️ Slide modals in/out
  function showSlide(modalEl) {
    modalEl.classList.add('slide', 'in');
    modalEl.classList.remove('out');
  }
  function hideSlide(modalEl) {
    modalEl.classList.add('out');
    modalEl.classList.remove('in');
    modalEl.addEventListener('transitionend', function cleanup() {
      modalEl.classList.remove('slide', 'out');
      modalEl.removeEventListener('transitionend', cleanup);
    });
  }

  // 📩 Contact modal logic
  contactBtn.onclick = e => {
    e.preventDefault();
    showSlide(contactModal);
  };
  contactClose.onclick = () => hideSlide(contactModal);

  // ℹ️ About modal logic
  aboutBtn.onclick = e => {
    e.preventDefault();
    showSlide(aboutModal);
  };
  aboutClose.onclick = () => hideSlide(aboutModal);

  // Click outside to close modal
  window.addEventListener('click', e => {
    if (e.target === contactModal) hideSlide(contactModal);
    if (e.target === aboutModal) hideSlide(aboutModal);
    if (e.target === modal) modal.classList.remove('show');
  });

  // 🚀 Fake submit behavior for Contact form
  contactForm.onsubmit = e => {
    e.preventDefault();
    hideSlide(contactModal);
    thankYouModal.classList.add('show');
    setTimeout(() => thankYouModal.classList.remove('show'), 3000);
  };

  // ❌ Close details modal
  closeBtn.onclick = () => modal.classList.remove('show');

  // 🔍 Basic OMDb fetch by type
  async function searchByType(query, type) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}`);
    const data = await res.json();
    return data.Response === 'True' ? data.Search.slice(0, 5) : [];
  }

  // 🕳 Skeleton loader cards
  function showSkeletons(container) {
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('div');
      s.className = 'movie-card skeleton-card';
      container.appendChild(s);
    }
  }

  // ♻️ Clear all 3 content areas
  function clearGrids() {
    moviesGrid.innerHTML = '';
    seriesGrid.innerHTML = '';
    gamesGrid.innerHTML = '';
  }

  // 🖼 Render cards to UI
  function renderCards(items, container) {
    items.forEach(item => {
      const c = document.createElement('div');
      c.className = 'movie-card';
      setTimeout(() => c.style.opacity = 1, 100);
      c.innerHTML = `
        <img src="${item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/160x240'}" alt="${item.Title}">
        <div class="card-info">
          <h3>${item.Title}</h3>
          <p>${item.Year}</p>
        </div>`;
      c.onclick = () => loadDetails(item.imdbID);
      container.appendChild(c);
    });
  }

  // 🧾 Load single title details
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

  // 🎯 Fire off search + render
  async function performSearch() {
    const q = input.value.trim();
    if (!q) return;
    clearGrids();

    const type = typeSelect.value;
    showSkeletons(moviesGrid);
    showSkeletons(seriesGrid);
    showSkeletons(gamesGrid);

    const [movies, series, games] = await Promise.all([
      searchByType(q, 'movie'),
      searchByType(q, 'series'),
      searchByType(q, 'game')
    ]);

    clearGrids();
    if (type === 'movie') renderCards(movies, moviesGrid);
    if (type === 'series') renderCards(series, seriesGrid);
    if (type === 'game') renderCards(games, gamesGrid);
  }

  // Submit trigger
  form.onsubmit = e => {
    e.preventDefault();
    performSearch();
  };

  // 🏆 Demo content to preload on "Home"
  const topMovies = ["Dune","Oppenheimer","Barbie","John Wick","Spider-Man"];
  const topShows = ["Stranger Things","Breaking Bad","Loki","The Boys","The Mandalorian"];
  const topGames = ["Grand Theft Auto V","Cyberpunk 2077","Halo","Zelda","Final Fantasy"];

  async function loadTop(titles, type, container) {
    clearGrids();
    showSkeletons(container);
    for (let i = 0; i < 5; i++) {
      const results = await searchByType(titles[i], type);
      if (results.length) renderCards([results[0]], container);
    }
  }

  function initTop() {
    loadTop(topMovies, 'movie', moviesGrid);
    loadTop(topShows, 'series', seriesGrid);
    loadTop(topGames, 'game', gamesGrid);
  }

  // 🏠 Home button reinitializes demo content
  document.getElementById('homeBtn').onclick = e => {
    e.preventDefault();
    input.value = '';
    initTop();
  };

  // 🚦 Load top 5 default sets on first visit
  initTop();
});
