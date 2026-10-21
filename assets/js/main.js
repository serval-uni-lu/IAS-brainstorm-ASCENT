(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('is-open', !expanded);
  });
  navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });
  const filters = document.querySelectorAll('[data-filter]');
  const people = document.querySelectorAll('[data-group]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    people.forEach(person => { person.hidden = button.dataset.filter !== 'all' && person.dataset.group !== button.dataset.filter; if (!person.hidden) count++; });
    document.querySelector('#people-status').textContent = `${count} confirmed participants shown.`;
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) navigation.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id)); });
    }, { rootMargin: '-20% 0px -60% 0px' });
    navigation.querySelectorAll('a').forEach(a => { const section = document.querySelector(a.hash); if (section) observer.observe(section); });
  }
})();
