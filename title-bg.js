(function () {
  'use strict';
  var canvas = document.getElementById('title-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var NODE_COUNT = 80;
  var LINK_THRESHOLD = 150;
  var DAMPING = 0.98;
  var SPEED = 0.7;
  var COLOR = [148, 182, 239];
  var NODE_RADIUS = 2.5;
  var raf = 0;
  var mouse = { x: -1000, y: -1000 };
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var isHovering = false;
  var initialPlay = true;

  function resize() {
    var parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }
  resize();

  var nodes = [];
  for (var i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }

  canvas.addEventListener('mouseenter', function () {
    isHovering = true;
  });

  canvas.addEventListener('mousemove', function (e) {
    isHovering = true;
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    isHovering = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isHovering) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var dx = mouse.x - node.x;
        var dy = mouse.y - node.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
          var force = 0.3 / dist;
          node.vx += dx * force * SPEED;
          node.vy += dy * force * SPEED;
        }
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.x += node.vx * SPEED;
        node.y += node.vy * SPEED;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx2 = nodes[i].x - nodes[j].x;
        var dy2 = nodes[i].y - nodes[j].y;
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < LINK_THRESHOLD) {
          var alpha = (1 - dist2 / LINK_THRESHOLD) * 0.25;
          ctx.strokeStyle = 'rgba(' + COLOR[0] + ',' + COLOR[1] + ',' + COLOR[2] + ',' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = 'rgba(' + COLOR[0] + ',' + COLOR[1] + ',' + COLOR[2] + ', 0.6)';
    for (var i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(loop);
  }

  if (prefersReducedMotion) {
    loop();
    cancelAnimationFrame(raf);
  } else {
    // Initial entrance animation: play for 2 seconds then pause
    isHovering = true;
    loop();
    setTimeout(function () {
      if (!isHovering || initialPlay) {
        isHovering = canvas.matches(':hover');
      }
      initialPlay = false;
    }, 2000);
  }

  window.addEventListener('resize', function () {
    resize();
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].x > canvas.width) nodes[i].x = Math.random() * canvas.width;
      if (nodes[i].y > canvas.height) nodes[i].y = Math.random() * canvas.height;
    }
  });
})();
