(() => {
  try {
    const t = localStorage.getItem('theme');
    const d = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme:dark)').matches);
    document.documentElement.classList.toggle('dark', d);
    document.documentElement.classList.toggle('light', !d);
  } catch (_e) {}
})();
