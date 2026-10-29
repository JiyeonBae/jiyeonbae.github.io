// Toggle topic buttons to filter publications/posters. All topics start on;
// an item is shown when at least one of its topics is on.
(function () {
  var buttons = document.querySelectorAll('.pub-filter button');
  if (!buttons.length) return;
  var items = document.querySelectorAll('.pub[data-tags]');

  function apply() {
    var active = [];
    buttons.forEach(function (b) {
      if (b.getAttribute('aria-pressed') === 'true') active.push(b.dataset.filter);
    });
    items.forEach(function (item) {
      var tags = item.dataset.tags.split(' ');
      var show = active.some(function (t) { return tags.indexOf(t) !== -1; });
      item.classList.toggle('is-filtered-out', !show);
    });
    // Hide a section when none of its items match, but keep the one holding
    // the filter buttons visible (with an empty-state note) so it can be undone.
    document.querySelectorAll('section.block').forEach(function (sec) {
      if (!sec.querySelector('.pub[data-tags]')) return;
      var empty = !sec.querySelector('.pub[data-tags]:not(.is-filtered-out)');
      if (sec.querySelector('.pub-filter')) {
        var note = sec.querySelector('.pub-empty');
        if (note) note.hidden = !empty;
      } else {
        sec.classList.toggle('is-filtered-out', empty);
      }
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      apply();
    });
  });
})();
