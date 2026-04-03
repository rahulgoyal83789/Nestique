// Navbar Search Functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('suggestionsBox');

  if (!searchInput || !suggestionsBox) return;

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();

    if (query.length < 1) {
      suggestionsBox.style.display = 'none';
      return;
    }

    try {
      const res = await fetch(`/listings/search-suggestions?q=${query}`);
      const suggestions = await res.json();

      if (suggestions.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
      }

      suggestionsBox.innerHTML = suggestions
        .map(
          (s) => `
        <div class="suggestion-item" onclick="window.location='/listings/${s.id}'">
          <i class="fa-solid fa-location-dot" style="color:#fe424d; font-size:14px;"></i>
          <div>
            <div style="font-weight:500; font-size:0.9rem;">${s.title}</div>
            <div style="font-size:0.75rem; color:gray;">${s.location}</div>
          </div>
        </div>
      `
        )
        .join('');

      suggestionsBox.style.display = 'block';
    } catch (err) {
      console.error('Error fetching search suggestions:', err);
    }
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });
});