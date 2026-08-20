// Partials loader — progressive enhancement, no build required. Usage: <div data-partial="/partials/header.html"></div>
document.addEventListener('DOMContentLoaded', async () => {
  const nodes = document.querySelectorAll('[data-partial]');
  for (const el of nodes) {
    try {
      const res = await fetch(el.dataset.partial);
      if (res.ok) el.innerHTML = await res.text();
    } catch {}
  }
});
