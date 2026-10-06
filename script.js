/* Алмаз Софт — меню и лайтбокс (vanilla JS, без зависимостей) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Бургер-меню ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("is-open", open);
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Лайтбокс ---------- */
  var dlg = document.getElementById("lightbox");
  if (!dlg || typeof dlg.showModal !== "function") return; // без поддержки — ссылки просто открывают картинку
  var img = document.createElement("img");
  img.className = "lightbox__img";
  img.decoding = "async";
  dlg.querySelector(".lightbox__figure").prepend(img);
  var cap = dlg.querySelector(".lightbox__caption");
  var items = [], index = 0, opener = null;

  function show(i) {
    index = (i + items.length) % items.length;
    var a = items[index];
    img.src = a.getAttribute("href");
    img.alt = a.dataset.caption || "";
    cap.textContent = a.dataset.caption || "";
  }
  function open(link) {
    items = Array.prototype.slice.call(document.querySelectorAll('[data-gallery="' + link.dataset.gallery + '"]'));
    opener = link;
    show(items.indexOf(link));
    dlg.showModal();
    document.body.classList.add("lb-open");
  }
  dlg.addEventListener("close", function () {
    document.body.classList.remove("lb-open");
    img.removeAttribute("src");
    if (opener) opener.focus();
  });
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-gallery]");
    if (!link) return;
    e.preventDefault();
    open(link);
  });
  dlg.querySelector(".lightbox__close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
  dlg.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("lightbox__figure")) dlg.close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
  });
  /* свайпы на телефоне */
  var x0 = null;
  dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
