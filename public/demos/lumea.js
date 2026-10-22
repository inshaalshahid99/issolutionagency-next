/* lumea demo behaviour (ported verbatim from the preview). Runs once. */
(function(){if(window.__issDemoInit)return;window.__issDemoInit=true;
(function () {
        var $ = function (s, r) { return (r || document).querySelector(s); };
        var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
        var FREE = 60;
        var P = {
          serum: { name: "Glow Serum", cat: "Serums", size: "30ml", price: 38, key: "Niacinamide, hyaluronic acid", use: "3 drops after toner, AM and PM",
            desc: "A lightweight brightening serum that helps even tone and refine the look of pores, without stickiness." },
          cleanser: { name: "Cloud Foam Cleanser", cat: "Cleansers", size: "150ml", price: 24, key: "Gentle amino-acid cleansers", use: "Massage onto damp skin, rinse",
            desc: "A soft, low-foam gel that lifts makeup, SPF and the day's build-up, leaving skin clean but never tight." },
          cream: { name: "Barrier Cream", cat: "Moisturisers", size: "50ml", price: 42, key: "Ceramides", use: "Pea-sized amount, last step",
            desc: "A rich yet breathable cream that supports the skin barrier and locks moisture in for hours." },
          toner: { name: "Balance Toner", cat: "Toners", size: "120ml", price: 26, key: "Hyaluronic acid", use: "Pat in after cleansing",
            desc: "An alcohol-free hydrating toner that rebalances skin after cleansing and preps it for serum." },
          ritual: { name: "The Full Ritual", cat: "Bundle", size: "All four essentials", price: 112 }
        };
        var cart = {}; // id -> qty, in memory only
        var fmt = function (n) { return "$" + n.toFixed(n % 1 ? 2 : 0); };
        var say = function (t) { var a = $("#announce"); a.textContent = ""; setTimeout(function () { a.textContent = t; }, 30); };

        /* header */
        var header = $("#header");
        addEventListener("scroll", function () { header.classList.toggle("is-scrolled", scrollY > 4); }, { passive: true });
        var nav = $("#nav"), menuBtn = $("#menuBtn");
        function setMenu(open) { nav.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
        menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
        $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); } });

        /* search + filters */
        var searchBtn = $("#searchBtn"), panel = $("#searchPanel"), input = $("#searchInput");
        searchBtn.addEventListener("click", function () {
          var open = panel.hidden; panel.hidden = !open; searchBtn.setAttribute("aria-expanded", open);
          if (open) input.focus(); else { input.value = ""; apply(); }
        });
        var filter = "all";
        function apply() {
          var q = input.value.trim().toLowerCase(), shown = 0;
          $$("#grid > [data-id]").forEach(function (el) {
            var p = P[el.dataset.id];
            var catOk = filter === "all" ? true : el.dataset.cat === filter;
            var qOk = !q || (p.name + " " + p.cat + " " + (p.key || "")).toLowerCase().indexOf(q) > -1;
            var show = catOk && qOk; el.hidden = !show; if (show) shown++;
          });
          $("#empty").hidden = shown > 0;
          $("#filterStatus").textContent = shown + (shown === 1 ? " product" : " products") + " shown";
        }
        input.addEventListener("input", function () {
          apply();
          if (input.value.trim()) $("#shop").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        });
        $$(".x-chip").forEach(function (b) {
          b.addEventListener("click", function () {
            filter = b.dataset.filter;
            $$(".x-chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b); });
            apply();
          });
        });

        /* dialogs */
        function open(d) { if (!d.open) d.showModal(); }
        $$("dialog").forEach(function (d) {
          d.addEventListener("click", function (e) {
            if (e.target === d) d.close();
            var c = e.target.closest("[data-close]");
            if (c) { d.close(); if (c.dataset.goto) $(c.dataset.goto).scrollIntoView(); }
          });
        });
        function notice(title, text) { $("#noticeTitle").textContent = title; $("#noticeText").textContent = text; open($("#notice")); }
        $("#checkoutBtn").addEventListener("click", function () { notice("Demo store", "Demo store, checkout is disabled."); });
        $("#quizBtn").addEventListener("click", function () { notice("Skin quiz", "The skin quiz is a placeholder in this demo store. Start with the three-step ritual below."); });
        $$("[data-demo]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); notice("Demo store", "This page is not part of the demo build."); }); });

        /* cart */
        var drawer = $("#drawer");
        function add(id, qty) {
          cart[id] = (cart[id] || 0) + (qty || 1);
          render();
          var c = $("#bagCount"); c.classList.remove("is-bump"); void c.offsetWidth; c.classList.add("is-bump");
          say(P[id].name + " added to bag");
        }
        function thumb(id) {
          var box = document.createElement("div"); box.className = "x-item__img";
          var src = $('#grid [data-id="' + id + '"] img');
          if (src) box.appendChild(src.cloneNode()); else { box.classList.add("x-item__img--bundle"); box.textContent = "×4"; box.setAttribute("aria-hidden", "true"); }
          var im = box.querySelector("img"); if (im) im.alt = "";
          return box;
        }
        function render() {
          var ids = Object.keys(cart), count = 0, sub = 0, list = $("#items");
          list.innerHTML = "";
          ids.forEach(function (id) {
            var p = P[id], q = cart[id]; count += q; sub += p.price * q;
            var li = document.createElement("li"); li.className = "x-item";
            li.appendChild(thumb(id));
            var mid = document.createElement("div");
            mid.innerHTML = '<h3></h3><p class="x-meta"></p><div class="x-qty" role="group"><button data-dec aria-label="Decrease quantity">−</button><output aria-live="polite"></output><button data-inc aria-label="Increase quantity">+</button></div>';
            mid.querySelector("h3").textContent = p.name;
            mid.querySelector(".x-meta").textContent = p.size + " · " + fmt(p.price);
            mid.querySelector(".x-qty").setAttribute("aria-label", "Quantity of " + p.name);
            mid.querySelector("output").textContent = q;
            var side = document.createElement("div"); side.className = "x-item__side";
            side.innerHTML = '<span class="x-price"></span><button class="x-link" data-rm>Remove</button>';
            side.querySelector(".x-price").textContent = fmt(p.price * q);
            side.querySelector("[data-rm]").setAttribute("aria-label", "Remove " + p.name);
            li.appendChild(mid); li.appendChild(side);
            li.addEventListener("click", function (e) {
              if (e.target.closest("[data-inc]")) { cart[id]++; render(); focusIn(id, "[data-inc]"); }
              else if (e.target.closest("[data-dec]")) { if (--cart[id] < 1) { delete cart[id]; render(); say(p.name + " removed"); focusFallback(); } else { render(); focusIn(id, "[data-dec]"); } }
              else if (e.target.closest("[data-rm]")) { delete cart[id]; render(); say(p.name + " removed from bag"); focusFallback(); }
            });
            li.dataset.id = id;
            list.appendChild(li);
          });
          $("#bagCount").textContent = count;
          $("#bagBtn").setAttribute("aria-label", "Open bag, " + count + (count === 1 ? " item" : " items"));
          $("#subtotal").textContent = fmt(sub);
          var left = Math.max(0, FREE - sub);
          $("#shipMsg").textContent = sub === 0 ? "Free shipping over $60" : left > 0 ? "You're " + fmt(left) + " away from free shipping" : "You've unlocked free shipping";
          var bar = $("#shipBar"); bar.setAttribute("aria-valuenow", Math.min(sub, FREE));
          bar.firstElementChild.style.width = Math.min(100, (sub / FREE) * 100) + "%";
          var empty = ids.length === 0;
          $("#drawerEmpty").hidden = !empty; $("#drawerFoot").hidden = empty; list.hidden = empty;
        }
        function focusIn(id, sel) { var b = $('#items [data-id="' + id + '"] ' + sel); if (b) b.focus(); }
        function focusFallback() { var b = $("#items button") || $("#drawerEmpty button"); if (b) b.focus(); }

        $$("[data-add]").forEach(function (b) {
          b.addEventListener("click", function () { add(b.dataset.add); open(drawer); });
        });
        $("#bagBtn").addEventListener("click", function () { open(drawer); });

        /* quick view */
        var qv = $("#quick"), current = null;
        $$("[data-quick]").forEach(function (b) {
          b.addEventListener("click", function () {
            var id = b.dataset.quick, p = P[id]; current = id;
            var media = $("#qvMedia"); media.innerHTML = "";
            var img = b.parentNode.querySelector("img").cloneNode(); media.appendChild(img);
            $("#qvCat").textContent = p.cat; $("#qvTitle").textContent = p.name; $("#qvPrice").textContent = fmt(p.price);
            $("#qvDesc").textContent = p.desc; $("#qvSize").textContent = p.size; $("#qvKey").textContent = p.key; $("#qvUse").textContent = p.use;
            $("#qvAdd").textContent = "Add to bag · " + fmt(p.price);
            open(qv);
          });
        });
        $("#qvAdd").addEventListener("click", function () { if (current) { add(current); qv.close(); open(drawer); } });

        /* newsletter */
        var form = $("#newsForm"), email = $("#email"), msg = $("#newsMsg");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var v = email.value.trim();
          var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
          email.setAttribute("aria-invalid", ok ? "false" : "true");
          msg.className = "x-formmsg " + (ok ? "is-ok" : "is-error");
          msg.textContent = !v ? "Please enter your email address." : !ok ? "That email doesn't look right. Try name@example.com." : "Thanks! Demo form, nothing is sent. Your code would be LUMEA10.";
          if (ok) form.reset(); else email.focus();
        });
        email.addEventListener("input", function () { if (email.getAttribute("aria-invalid") === "true") { email.removeAttribute("aria-invalid"); msg.textContent = ""; } });

        render(); apply();
      })();
})();
