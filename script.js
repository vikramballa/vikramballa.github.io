(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme toggle: explicit choice wins over the OS preference
  var themeBtn = document.getElementById("theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function currentTheme() {
    return root.getAttribute("data-theme") || (media.matches ? "dark" : "light");
  }
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");
  function setMenu(open) {
    links.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!links.classList.contains("is-open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Nav border + scroll progress bar
  var nav = document.querySelector(".nav");
  var progress = document.getElementById("progress");
  var ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Rotating "I build ..." words, typed and erased
  var rotator = document.getElementById("rotator");
  var words = [
    "agentic AI systems",
    "multi-agent LLM workflows",
    "intelligent automation platforms",
    "retrieval-augmented generation",
    "real-time speech AI",
    "production ML systems"
  ];
  if (rotator && !reduceMotion) {
    var w = 0, len = words[0].length, deleting = true;
    var step = function () {
      var delay = deleting ? 32 : 60;
      if (deleting) {
        len--;
        if (len === 0) { deleting = false; w = (w + 1) % words.length; delay = 250; }
      } else {
        len++;
        if (len === words[w].length) { deleting = true; delay = 2000; }
      }
      rotator.textContent = words[w].slice(0, len) || " ";
      setTimeout(step, delay);
    };
    setTimeout(step, 2600);
  }

  // Marquee: duplicate the list once so the loop is seamless
  var track = document.querySelector(".marquee__track");
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  // Number of each pipeline step, for the sequenced fade-in
  document.querySelectorAll(".flow").forEach(function (flow) {
    Array.prototype.forEach.call(flow.children, function (li, i) { li.style.setProperty("--n", i); });
  });

  // Stagger cards that sit next to each other in the grid
  document.querySelectorAll(".projects .card:not(.card--feature)").forEach(function (card, i) {
    card.style.transitionDelay = (i % 2) * 90 + "ms";
    card.addEventListener("transitionend", function clear(e) {
      if (e.propertyName === "opacity") { card.style.transitionDelay = ""; card.removeEventListener("transitionend", clear); }
    });
  });

  // Soft spotlight that follows the pointer on cards
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  // Count the stats up from zero
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var suffix = el.dataset.suffix || "";
    var prefix = el.dataset.prefix || "";
    var start = null, duration = 1400;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Reveal on scroll + active nav link
  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        if (!reduceMotion) entry.target.querySelectorAll("[data-count]").forEach(countUp);
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });

    var navLinks = links.querySelectorAll("a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { spy.observe(s); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
