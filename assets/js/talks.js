(function () {
  var q = document.getElementById('q');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var talks = Array.prototype.slice.call(document.querySelectorAll('.talk'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.year'));
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var active = new Set();

  function apply() {
    var term = (q.value || '').trim().toLowerCase();
    var shown = 0;
    talks.forEach(function (el) {
      var tags = (el.dataset.tags || '').split('|');
      var okTag = active.size === 0 || tags.some(function (t) { return active.has(t); });
      var okText = !term || el.dataset.text.indexOf(term) !== -1;
      el.hidden = !(okTag && okText);
      if (!el.hidden) shown++;
    });
    years.forEach(function (y) { y.hidden = !y.querySelector('.talk:not([hidden])'); });
    count.textContent = shown === talks.length ? 'Showing all ' + shown + ' talks' : 'Showing ' + shown + ' of ' + talks.length + ' talks';
    empty.hidden = shown !== 0;
  }

  q.addEventListener('input', apply);
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var tag = c.dataset.tag;
      if (active.has(tag)) { active.delete(tag); c.setAttribute('aria-pressed', 'false'); }
      else { active.add(tag); c.setAttribute('aria-pressed', 'true'); }
      apply();
    });
  });

  // Play YouTube videos inline; other video links open normally.
  function youtubeId(href) {
    var m = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  document.querySelectorAll('a[data-video]').forEach(function (a) {
    var id = youtubeId(a.href);
    if (!id) return;
    a.setAttribute('role', 'button');
    a.setAttribute('aria-expanded', 'false');
    a.textContent = '▶ Watch';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var card = a.closest('.talk');
      var existing = card.querySelector('.embed');
      if (existing) { existing.remove(); a.textContent = '▶ Watch'; a.setAttribute('aria-expanded', 'false'); return; }
      var box = document.createElement('div');
      box.className = 'embed';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
      f.title = card.querySelector('h3').textContent;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      box.appendChild(f);
      card.appendChild(box);
      a.textContent = '✕ Close video';
      a.setAttribute('aria-expanded', 'true');
    });
  });

  apply();
})();
