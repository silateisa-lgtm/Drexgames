let games = [];
let searchQuery = '';
let selectedCategory = 'All';

async function init() {
  try {
    const response = await fetch('./src/games.json');
    games = await response.json();
    renderCategories();
    renderGames();
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function renderCategories() {
  const categories = ['All', ...new Set(games.map(g => g.category))];
  const container = document.getElementById('category-filters');
  container.innerHTML = categories.map(cat => `
    <button
      onclick="setCategory('${cat}')"
      class="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
        selectedCategory === cat 
          ? 'bg-[#7000ff] border-[#7000ff] text-white shadow-[0_0_20px_rgba(112,0,255,0.4)]' 
          : 'bg-[#0f0f13] border-[#1f1f27] text-[#88888f] hover:bg-[#1a1a24] hover:text-white'
      }"
    >
      ${cat}
    </button>
  `).join('');
}

function setCategory(cat) {
  selectedCategory = cat;
  renderCategories();
  renderGames();
}

function onSearch(query) {
  searchQuery = query;
  renderGames();
}

function renderGames() {
  const filtered = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const container = document.getElementById('game-grid');
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-20 text-center space-y-4">
        <p class="text-[#88888f] font-medium text-lg italic">No results found in the VOID.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((game, index) => `
    <div 
      onclick="openGame('${game.id}')"
      class="group cursor-pointer bg-[#19192399] border border-[#1f1f27] rounded-xl overflow-hidden hover:border-[#7000ff] hover:shadow-[0_0_30px_rgba(112,0,255,0.15)] transition-all duration-300 flex flex-col"
      style="animation: fadeIn 0.3s ease-out ${index * 0.05}s both"
    >
      <div class="relative aspect-video overflow-hidden">
        ${index === 0 ? '<div class="absolute top-3 right-3 bg-[#7000ff] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase z-10">New</div>' : ''}
        <img 
          src="${game.thumbnail}" 
          alt="${game.title}"
          class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          referrerpolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between">
        <h3 class="font-bold text-[16px] text-white group-hover:text-[#7000ff] transition-colors">
          ${game.title}
        </h3>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-[#88888f] font-medium uppercase tracking-wider">${game.category} • 4.8★</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openGame(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;

  const listSection = document.getElementById('list-section');
  const viewSection = document.getElementById('view-section');
  const iframe = document.getElementById('game-iframe');
  const title = document.getElementById('game-title-display');
  const desc = document.getElementById('game-desc-display');
  const cat = document.getElementById('game-cat-display');

  iframe.src = game.iframeUrl;
  title.innerText = game.title.toUpperCase();
  desc.innerText = game.description;
  cat.innerText = game.category;

  listSection.classList.add('hidden');
  viewSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGame() {
  const listSection = document.getElementById('list-section');
  const viewSection = document.getElementById('view-section');
  const iframe = document.getElementById('game-iframe');
  
  iframe.src = '';
  listSection.classList.remove('hidden');
  viewSection.classList.add('hidden');
}

function toggleFullScreen() {
  const iframe = document.getElementById('game-iframe');
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen();
  }
}

function reloadGame() {
  const iframe = document.getElementById('game-iframe');
  const currentSrc = iframe.src;
  iframe.src = '';
  setTimeout(() => {
    iframe.src = currentSrc;
  }, 100);
}

// Global exposure for onclick handlers
window.setCategory = setCategory;
window.onSearchInput = (e) => onSearch(e.target.value);
window.clearSearch = () => {
    document.getElementById('search-input').value = '';
    onSearch('');
};
window.openGame = openGame;
window.closeGame = closeGame;
window.toggleFullScreen = toggleFullScreen;
window.reloadGame = reloadGame;

window.addEventListener('DOMContentLoaded', init);
