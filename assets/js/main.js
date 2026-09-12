/**
 * Les Évadés — interactions générales (menu mobile, jour courant dans les horaires)
 */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Met en avant le jour actuel dans les grilles d'horaires (data-day="1".."7", 1 = lundi)
  var todayIndex = new Date().getDay(); // 0 = dimanche
  var isoDay = todayIndex === 0 ? 7 : todayIndex;
  document.querySelectorAll(".hours-card[data-day]").forEach(function (card) {
    if (parseInt(card.getAttribute("data-day"), 10) === isoDay) {
      card.classList.add("is-today");
    }
  });
})();
