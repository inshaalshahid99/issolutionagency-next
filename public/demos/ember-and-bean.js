/* ember-and-bean demo behaviour (ported verbatim from the preview). Runs once. */
(function(){if(window.__issDemoInit)return;window.__issDemoInit=true;
(function () {
        var doc = document;
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // top bar
        var bar = doc.getElementById("topbar");
        var barClose = doc.getElementById("topbar-close"); if (barClose) barClose.addEventListener("click", function () { bar.hidden = true; });

        // sticky header
        var header = doc.getElementById("header");
        function onScroll() { header.classList.toggle("is-solid", window.scrollY > 40); }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // hamburger
        var burger = doc.getElementById("burger");
        function setOpen(open) {
          header.classList.toggle("is-open", open);
          burger.setAttribute("aria-expanded", open ? "true" : "false");
          burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        }
        burger.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
        [].forEach.call(doc.querySelectorAll("#site-menu a"), function (a) { a.addEventListener("click", function () { setOpen(false); }); });
        doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); burger.focus(); } });
        window.addEventListener("resize", function () { if (window.innerWidth > 860) setOpen(false); });

        // tabs
        var tabs = [].slice.call(doc.querySelectorAll('[role="tab"]'));
        function select(tab, focus) {
          tabs.forEach(function (t) {
            var on = t === tab, panel = doc.getElementById(t.getAttribute("aria-controls"));
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.tabIndex = on ? 0 : -1;
            panel.hidden = !on;
            panel.classList.toggle("is-in", on);
          });
          if (focus) tab.focus();
        }
        tabs.forEach(function (t, i) {
          t.addEventListener("click", function () { select(t); });
          t.addEventListener("keydown", function (e) {
            var n = null;
            if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
            if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === "Home") n = tabs[0];
            if (e.key === "End") n = tabs[tabs.length - 1];
            if (n) { e.preventDefault(); select(n, true); }
          });
        });

        // today's hours
        var today = new Date().getDay();
        [].forEach.call(doc.querySelectorAll(".x-hours tr[data-days]"), function (tr) {
          if (tr.getAttribute("data-days").split(",").indexOf(String(today)) > -1) tr.classList.add("is-today");
        });

        // fade-up on scroll
        var items = [].slice.call(doc.querySelectorAll(".x-reveal"));
        if (reduce || !("IntersectionObserver" in window)) {
          items.forEach(function (el) { el.classList.add("is-in"); });
        } else {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
          }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
          items.forEach(function (el) { io.observe(el); });
        }

        // newsletter validation (demo only)
        var form = doc.getElementById("newsletter");
        var status = doc.getElementById("nl-status");
        var fields = {
          name: { input: doc.getElementById("nl-name"), wrap: doc.getElementById("f-name"), err: doc.getElementById("nl-name-err"),
            check: function (v) { return v.trim().length >= 2 ? "" : "Please enter your first name."; } },
          email: { input: doc.getElementById("nl-email"), wrap: doc.getElementById("f-email"), err: doc.getElementById("nl-email-err"),
            check: function (v) { if (!v.trim()) return "Please enter your email address."; return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "That email doesn't look right. Try name@example.com."; } },
          consent: { input: doc.getElementById("nl-consent"), wrap: doc.getElementById("f-consent"), err: doc.getElementById("nl-consent-err"),
            check: function (_, el) { return el.checked ? "" : "Please tick the box to subscribe."; } }
        };
        function validate(key) {
          var f = fields[key], msg = f.check(f.input.value, f.input);
          f.err.textContent = msg;
          f.wrap.classList.toggle("is-error", !!msg);
          f.input.setAttribute("aria-invalid", msg ? "true" : "false");
          return !msg;
        }
        Object.keys(fields).forEach(function (k) {
          var f = fields[k];
          f.input.addEventListener(k === "consent" ? "change" : "blur", function () { if (k === "consent" || f.input.value) validate(k); });
          f.input.addEventListener("input", function () { if (f.wrap.classList.contains("is-error")) validate(k); });
        });
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          status.textContent = "";
          status.className = "x-status";
          var firstBad = null;
          Object.keys(fields).forEach(function (k) { if (!validate(k) && !firstBad) firstBad = fields[k].input; });
          if (firstBad) { firstBad.focus(); return; }
          status.classList.add("is-ok");
          status.textContent = "Thanks, " + fields.name.input.value.trim() + "! This is a demo form, so nothing was sent.";
          form.reset();
          Object.keys(fields).forEach(function (k) { fields[k].input.removeAttribute("aria-invalid"); });
        });
      })();
})();
