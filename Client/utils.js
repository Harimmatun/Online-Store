export function toggleTheme() {
  const themeSwitch = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('themeLabel');
  if (themeSwitch && themeLabel) {
    const isDark = themeSwitch.checked;
    document.body.classList.toggle('dark-theme', isDark);
    themeLabel.textContent = isDark ? 'Світла тема' : 'Темна тема';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}