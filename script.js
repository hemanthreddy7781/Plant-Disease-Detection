// Create the Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Add animation class when element is in view
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, {
  threshold: 0.1  // Trigger when at least 10% of the element is visible
});

// Elements to observe
const sections = [
  '.hero',
  '.assistancesection',
  '.grid-container',
  '.useandfaq',
  '.container',
  '.footer'
].forEach(selector => {
  const element = document.querySelector(selector);
  if (element) observer.observe(element);
}); 