const articles = [
  {
    title: "The Rising Strategic Value of Creative in Digital Advertising",
    date: "December 4th, 2025",
    company: "",
    concept: "",
    url: "#",
    icon: "assets/documenticon.png",
    type: "article",
    iconScale: 0.931,
  },
  {
    title: "Tech History Slide Deck",
    date: "December 22nd, 2024",
    company: "",
    concept: "",
    url: "#",
    icon: "assets/slidedeck.png",
    type: "deck",
  },
  {
    title: "FactGrid Cuneiform Research Poster",
    date: "May 1st, 2024",
    company: "",
    concept: "",
    url: "#",
    icon: "assets/bwposter.png",
    type: "poster",
  },
];

const grid = document.querySelector("[data-article-grid]");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const modalArticle = document.querySelector("[data-modal-article]");
const modalPoster = document.querySelector("[data-modal-poster]");
const modalDeck = document.querySelector("[data-modal-deck]");

function renderArticles() {
  grid.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("a");
    card.href = "#";
    card.className = "icon-card";
    card.setAttribute("data-article", article.title);
    if (article.url && article.url !== "#") {
      card.href = article.url;
      card.target = article.target || "_self";
      if (card.target === "_blank") {
        card.rel = "noreferrer";
      }
    }
    const metaLine = article.date ? formatDate(article.date) : `${article.company} · ${article.concept}`;
    card.innerHTML = `
      <div class="icon" aria-hidden="true"></div>
      <div class="icon-label">${article.title}</div>
      ${metaLine ? `<div class="icon-meta">${metaLine}</div>` : ""}
    `;
    const iconEl = card.querySelector(".icon");
    if (iconEl) {
      const iconSrc = article.icon || "assets/docicon.png";
      const iconScale = article.iconScale || 1;
      iconEl.style.backgroundImage = `url(\"${iconSrc}\")`;
      iconEl.style.backgroundSize = `${iconScale * 100}% ${iconScale * 100}%`;
    }
    grid.appendChild(card);
  });
}

function formatDate(dateString) {
  if (!dateString) return "";
  if (isNaN(Date.parse(dateString))) {
    return dateString;
  }
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function openModal(article) {
  const showPoster = article.type === "poster";
  const showDeck = article.type === "deck";
  const showArticle = !showPoster && !showDeck;
  if (showArticle && modalTitle) {
    modalTitle.textContent = article.title;
  }
  if (modalArticle) {
    modalArticle.style.display = showArticle ? "block" : "none";
  }
  if (modalPoster) {
    modalPoster.style.display = showPoster ? "flex" : "none";
  }
  if (modalDeck) {
    modalDeck.style.display = showDeck ? "flex" : "none";
  }
  modal.classList.toggle("modal-poster", showPoster || showDeck);
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("modal-poster");
}

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-article]");
  if (!card) return;
  event.preventDefault();
  if (card.dataset.justDragged === "true") {
    delete card.dataset.justDragged;
    return;
  }
  const article = articles.find((item) => item.title === card.dataset.article);
  if (article) {
    openModal(article);
  }
});

function enableCardDragging() {
  const cards = Array.from(grid.querySelectorAll(".icon-card"));
  if (cards.length === 0) return;

  const gridRect = grid.getBoundingClientRect();
  const natural = new Map();
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    natural.set(card, {
      left: rect.left - gridRect.left,
      top: rect.top - gridRect.top,
      width: rect.width,
      height: rect.height,
    });
  });

  grid.style.display = "block";
  grid.style.position = "relative";

  let maxBottom = 0;
  cards.forEach((card) => {
    const n = natural.get(card);
    card.style.position = "absolute";
    card.style.width = `${n.width}px`;
    card.style.left = `${n.left}px`;
    card.style.top = `${n.top}px`;
    card.draggable = false;
    const bottom = n.top + n.height;
    if (bottom > maxBottom) maxBottom = bottom;
  });
  grid.style.minHeight = `${maxBottom + 40}px`;

  const DRAG_THRESHOLD = 5;
  let dragState = null;

  grid.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const card = event.target.closest(".icon-card");
    if (!card) return;
    dragState = {
      card,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origLeft: parseFloat(card.style.left) || 0,
      origTop: parseFloat(card.style.top) || 0,
      moved: false,
    };
    card.setPointerCapture(event.pointerId);
  });

  grid.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    dragState.moved = true;
    dragState.card.classList.add("dragging");
    dragState.card.style.left = `${dragState.origLeft + dx}px`;
    dragState.card.style.top = `${dragState.origTop + dy}px`;
  });

  function endDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const { card, moved } = dragState;
    if (card.hasPointerCapture(event.pointerId)) {
      card.releasePointerCapture(event.pointerId);
    }
    card.classList.remove("dragging");
    if (moved) {
      const top = parseFloat(card.style.top);
      const newBottom = top + card.offsetHeight + 40;
      const currentMin = parseFloat(grid.style.minHeight) || 0;
      if (newBottom > currentMin) grid.style.minHeight = `${newBottom}px`;
      card.dataset.justDragged = "true";
    }
    dragState = null;
  }

  grid.addEventListener("pointerup", endDrag);
  grid.addEventListener("pointercancel", endDrag);
}

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderArticles();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(enableCardDragging);
} else {
  enableCardDragging();
}
