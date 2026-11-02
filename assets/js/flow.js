// Animate the Home research-approach diagram once it scrolls into view.
// Without JS (or IntersectionObserver) the diagram simply shows, static.
(function () {
  var flow = document.querySelector('.flow');
  if (!flow || !('IntersectionObserver' in window)) return;
  flow.classList.add('flow--anim');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      flow.classList.add('is-in');
      io.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(flow);
})();
