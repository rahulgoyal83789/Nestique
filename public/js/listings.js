// Listings Page Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Filter Scroll Functionality
  const filtersDiv = document.getElementById('filters');
  const scrollLeft = document.getElementById('scrollLeft');
  const scrollRight = document.getElementById('scrollRight');

  if (scrollLeft && filtersDiv) {
    scrollLeft.addEventListener('click', () => {
      filtersDiv.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  if (scrollRight && filtersDiv) {
    scrollRight.addEventListener('click', () => {
      filtersDiv.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  // Tax Toggle Functionality
  const taxSwitch = document.getElementById('switchCheckDefault');
  
  if (taxSwitch) {
    taxSwitch.addEventListener('click', () => {
      const taxInfo = document.getElementsByClassName('tax-info');
      
      for (let info of taxInfo) {
        if (info.style.display !== 'inline') {
          info.style.display = 'inline';
        } else {
          info.style.display = 'none';
        }
      }
    });
  }
});