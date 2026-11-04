// Nav tree: grows once per browser session; clicking it shakes the crown and
// drops a few leaves that drift down and fade out.
(function () {
  var btn = document.querySelector('.tree-btn');
  if (!btn) return;
  var tree = btn.querySelector('.tree');
  var crown = btn.querySelector('.tree-crown');

  // Only play the growing animation on the first page of a visit.
  try {
    if (sessionStorage.getItem('treeGrown')) tree.classList.add('tree--grown');
    else sessionStorage.setItem('treeGrown', '1');
  } catch (e) {}

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var colors = ['#7cc392', '#8fcf9f', '#a6dbb3'];

  btn.addEventListener('click', function () {
    tree.classList.remove('is-shaking');
    void tree.getBoundingClientRect(); // restart the shake animation
    tree.classList.add('is-shaking');
    if (reduce) return;

    var r = crown.getBoundingClientRect();
    var n = 6 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) drop(r);
  });

  tree.addEventListener('animationend', function (e) {
    if (e.animationName === 'tree-shake') tree.classList.remove('is-shaking');
  });

  function drop(r) {
    var leaf = document.createElement('span');
    leaf.className = 'falling-leaf';
    leaf.style.background = colors[Math.floor(Math.random() * colors.length)];
    leaf.style.left = (r.left + Math.random() * r.width) + 'px';
    leaf.style.top = (r.top + Math.random() * r.height * 0.7) + 'px';
    document.body.appendChild(leaf);

    var fall = 160 + Math.random() * 220;
    var drift = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 40);
    var spin = (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 360);
    var anim = leaf.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + drift + 'px, ' + fall * 0.35 + 'px) rotate(' + spin * 0.35 + 'deg)', opacity: 1, offset: 0.35 },
      { transform: 'translate(' + (-drift * 0.4) + 'px, ' + fall * 0.7 + 'px) rotate(' + spin * 0.7 + 'deg)', opacity: 0.8, offset: 0.7 },
      { transform: 'translate(' + drift * 0.6 + 'px, ' + fall + 'px) rotate(' + spin + 'deg)', opacity: 0 }
    ], { duration: 1600 + Math.random() * 1000, delay: Math.random() * 250, easing: 'ease-in', fill: 'forwards' });
    anim.onfinish = function () { leaf.remove(); };
  }
})();
