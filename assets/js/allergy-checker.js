/**
 * Les Évadés — assistant allergènes
 * Génère le bouton flottant + la fenêtre de sélection des 14 allergènes
 * réglementaires UE, puis filtre les plats de la carte (attribut
 * data-allergens sur chaque .dish) selon le choix du visiteur.
 * L'affichage textuel des allergènes reste dans le HTML de carte.html :
 * ce script ne fait qu'ajouter la mise en forme interactive par-dessus.
 */
(function () {
  "use strict";

  var ALLERGENS = [
    { code: "gluten", label: "Gluten" },
    { code: "crustaces", label: "Crustacés" },
    { code: "oeufs", label: "Œufs" },
    { code: "poissons", label: "Poissons" },
    { code: "arachides", label: "Arachides" },
    { code: "soja", label: "Soja" },
    { code: "lait", label: "Lait" },
    { code: "fruits-a-coque", label: "Fruits à coque" },
    { code: "celeri", label: "Céleri" },
    { code: "moutarde", label: "Moutarde" },
    { code: "sesame", label: "Graines de sésame" },
    { code: "sulfites", label: "Sulfites" },
    { code: "lupin", label: "Lupin" },
    { code: "mollusques", label: "Mollusques" }
  ];

  var STORAGE_KEY = "lesevades-allergenes";

  function getSaved() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* stockage indisponible : on continue sans persistance */
    }
  }

  function buildAllergenGrid(selected) {
    return ALLERGENS.map(function (a) {
      var checked = selected.indexOf(a.code) !== -1 ? "checked" : "";
      return (
        '<label class="allergen-option">' +
        '<input type="checkbox" name="allergene" value="' + a.code + '" ' + checked + ">" +
        "<span>" + a.label + "</span>" +
        "</label>"
      );
    }).join("");
  }

  function injectModal(selected) {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "allergyModal";
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="allergyModalTitle">' +
      '<button type="button" class="modal-close" aria-label="Fermer">&times;</button>' +
      '<h2 id="allergyModalTitle">Une allergie ou une intolérance ?</h2>' +
      "<p>Cochez ce qui vous concerne : on vous indique aussitôt les plats de notre carte à privilégier ou à éviter.</p>" +
      '<div class="allergen-grid">' + buildAllergenGrid(selected) + "</div>" +
      '<div class="disclaimer">Ces indications sont établies à partir de nos recettes de base et peuvent varier selon les approvisionnements du jour. En cas d\'allergie sévère, merci de toujours le signaler à notre équipe en salle avant de commander — la liste officielle des allergènes reste aussi disponible sur simple demande.</div>' +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-primary" id="allergyApply">Voir les plats adaptés</button>' +
      '<button type="button" class="btn btn-outline" id="allergyReset" style="color:var(--maroon-900);border-color:var(--maroon-900);">Réinitialiser</button>' +
      "</div>" +
      '<div class="modal-result" id="allergyResult"></div>' +
      "</div>";
    document.body.appendChild(overlay);
    return overlay;
  }

  function injectFab() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "allergy-fab";
    btn.id = "allergyFab";
    btn.innerHTML = '<span aria-hidden="true">⚠️</span> Allergies ?';
    document.body.appendChild(btn);
    return btn;
  }

  function currentSelection(overlay) {
    var boxes = overlay.querySelectorAll('input[name="allergene"]:checked');
    return Array.prototype.map.call(boxes, function (b) {
      return b.value;
    });
  }

  function labelFor(code) {
    var found = ALLERGENS.filter(function (a) {
      return a.code === code;
    })[0];
    return found ? found.label : code;
  }

  function applyFilterToPage(selected) {
    var dishes = document.querySelectorAll(".dish[data-allergens]");
    if (!dishes.length) {
      return { ok: 0, avoid: 0, hasMenu: false };
    }
    var ok = 0;
    var avoid = 0;
    dishes.forEach(function (dish) {
      var raw = dish.getAttribute("data-allergens") || "";
      var dishAllergens = raw
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);

      dish.classList.remove("is-ok", "is-avoid");
      var existingTag = dish.querySelector(".dish-tag");
      if (existingTag) existingTag.remove();

      if (!selected.length) return;

      var conflicts = dishAllergens.filter(function (code) {
        return selected.indexOf(code) !== -1;
      });

      var tag = document.createElement("span");
      if (conflicts.length) {
        dish.classList.add("is-avoid");
        tag.className = "dish-tag avoid";
        tag.textContent = "À éviter : " + conflicts.map(labelFor).join(", ");
        avoid++;
      } else {
        dish.classList.add("is-ok");
        tag.className = "dish-tag ok";
        tag.textContent = "Compatible avec votre sélection";
        ok++;
      }
      dish.appendChild(tag);
    });
    return { ok: ok, avoid: avoid, hasMenu: true };
  }

  function clearFilterFromPage() {
    document.querySelectorAll(".dish").forEach(function (dish) {
      dish.classList.remove("is-ok", "is-avoid");
      var tag = dish.querySelector(".dish-tag");
      if (tag) tag.remove();
    });
  }

  function showResult(overlay, selected, stats) {
    var resultBox = overlay.querySelector("#allergyResult");
    if (!selected.length) {
      resultBox.classList.remove("is-visible");
      resultBox.innerHTML = "";
      return;
    }
    resultBox.classList.add("is-visible");
    var names = selected.map(labelFor).join(", ");
    if (stats.hasMenu) {
      resultBox.innerHTML =
        "<p>Allergènes sélectionnés : <strong>" + names + "</strong></p>" +
        "<p><strong>" + stats.ok + "</strong> plat(s) semblent compatibles, " +
        "<strong>" + stats.avoid + "</strong> plat(s) sont marqués « à éviter » sur la carte ci-dessous.</p>";
    } else {
      resultBox.innerHTML =
        "<p>Allergènes sélectionnés : <strong>" + names + "</strong>.</p>" +
        '<p>Direction <a href="carte.html?allergenes=' + encodeURIComponent(selected.join(",")) +
        '" style="color:var(--maroon-900);font-weight:700;">notre carte</a> pour voir le détail plat par plat.</p>';
    }
  }

  function readAllergensFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var raw = params.get("allergenes");
    if (!raw) return null;
    return raw
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function init() {
    var urlSelection = readAllergensFromUrl();
    var selected = urlSelection || getSaved();

    var fab = injectFab();
    var overlay = injectModal(selected);
    var closeBtn = overlay.querySelector(".modal-close");
    var applyBtn = overlay.querySelector("#allergyApply");
    var resetBtn = overlay.querySelector("#allergyReset");

    function open() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      fab.focus();
    }

    fab.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });

    applyBtn.addEventListener("click", function () {
      var sel = currentSelection(overlay);
      save(sel);
      var stats = applyFilterToPage(sel);
      showResult(overlay, sel, stats);
      if (stats.hasMenu) {
        var firstFlagged = document.querySelector(".dish.is-ok, .dish.is-avoid");
        if (firstFlagged) {
          close();
          firstFlagged.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    resetBtn.addEventListener("click", function () {
      overlay.querySelectorAll('input[name="allergene"]').forEach(function (b) {
        b.checked = false;
      });
      save([]);
      clearFilterFromPage();
      showResult(overlay, [], { ok: 0, avoid: 0, hasMenu: false });
    });

    // Applique tout de suite un filtre existant (retour visiteur ou lien partagé)
    if (selected.length) {
      var stats = applyFilterToPage(selected);
      showResult(overlay, selected, stats);
      if (urlSelection) save(urlSelection);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
