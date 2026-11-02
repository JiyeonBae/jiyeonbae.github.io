// Lightbox for project thumbnails: a .gallery-open button lists items in
// data-gallery (space-separated): image URLs, or "youtube:<id>" for a video.
// An optional data-start (0-based) picks the first item shown.
// Arrows/dots/swipe/keys step through; Esc, the close button, or a click on
// the backdrop closes it.
(function () {
  var openers = document.querySelectorAll('.gallery-open');
  if (!openers.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button type="button" class="lb-btn lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure class="lb-figure"><img alt="">' +
    '<iframe hidden allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>' +
    '<figcaption>' +
    '<div class="lb-count"></div><div class="lb-dots"></div></figcaption></figure>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var frame = box.querySelector('iframe');
  var count = box.querySelector('.lb-count');
  var dots = box.querySelector('.lb-dots');
  var images = [], index = 0, lastFocus = null, touchX = null;

  function show(i) {
    index = (i + images.length) % images.length;
    var item = images[index];
    var video = item.indexOf('youtube:') === 0;
    img.hidden = video;
    frame.hidden = !video;
    if (video) {
      img.removeAttribute('src');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + item.slice(8) + '?autoplay=1&rel=0';
    } else {
      frame.removeAttribute('src');  // stops a playing video
      img.src = item;
      img.alt = 'Photo ' + (index + 1) + ' of ' + images.length;
    }
    count.textContent = (index + 1) + ' / ' + images.length;
    dots.querySelectorAll('button').forEach(function (d, k) {
      d.setAttribute('aria-current', k === index ? 'true' : 'false');
    });
    // Preload neighbours so stepping feels instant.
    [index + 1, index - 1].forEach(function (k) {
      var next = images[(k + images.length) % images.length];
      if (next.indexOf('youtube:') !== 0) new Image().src = next;
    });
  }

  function open(list, from, start) {
    images = list;
    lastFocus = from;
    dots.innerHTML = '';
    images.forEach(function (_, k) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Go to photo ' + (k + 1));
      d.addEventListener('click', function () { show(k); });
      dots.appendChild(d);
    });
    var single = images.length < 2;
    box.querySelector('.lb-prev').hidden = single;
    box.querySelector('.lb-next').hidden = single;
    dots.hidden = single;
    count.hidden = single;
    show(start || 0);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    img.removeAttribute('src');
    frame.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  openers.forEach(function (b) {
    b.addEventListener('click', function () {
      open(b.dataset.gallery.trim().split(/\s+/), b, parseInt(b.dataset.start, 10) || 0);
    });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });
  box.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });
})();
