const articles = [
  {
    title: "The Rising Strategic Value of Creative in Digital Advertising",
    date: "December 4th, 2025",
    company: "",
    concept: "",
    url: "#",
  },
];

const grid = document.querySelector("[data-article-grid]");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");

function renderArticles() {
  grid.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("a");
    card.href = "#";
    card.className = "icon-card";
    card.setAttribute("data-article", article.title);
    const metaLine = article.date ? formatDate(article.date) : `${article.company} · ${article.concept}`;
    card.innerHTML = `
      <div class="icon" aria-hidden="true"></div>
      <div class="icon-label">${article.title}</div>
      ${metaLine ? `<div class="icon-meta">${metaLine}</div>` : ""}
    `;
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
  if (modalTitle) {
    modalTitle.textContent = article.title;
  }
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-article]");
  if (!card) return;
  event.preventDefault();
  const article = articles.find((item) => item.title === card.dataset.article);
  if (article) {
    openModal(article);
  }
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderArticles();
