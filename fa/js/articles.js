const ARTICLE_COVER_BASE = "../../shared/images/articles/";

const articlesListEl = document.getElementById("articles-list");
const noArticlesEl = document.getElementById("no-articles");
const filterBtns = document.querySelectorAll(".filter-btn");

let allArticles = [];
let currentFilter = "all";

function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "article-card";

  card.innerHTML = `
    <a href="article.html?id=${article.id}" class="article-card-link">
      <div class="article-card-cover">
        <img src="${ARTICLE_COVER_BASE}${article.cover}" alt="${article.title}" loading="lazy" />
      </div>

      <div class="article-card-body">
        <span class="article-card-category">${article.category}</span>
        <h3 class="article-card-title">${article.title}</h3>
        <p class="article-card-excerpt">${article.excerpt}</p>
        <time class="article-card-date" datetime="${article.date}">${article.date}</time>
      </div>
    </a>
  `;

  return card;
}

function renderArticles() {
  articlesListEl.innerHTML = "";

  const filtered =
    currentFilter === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === currentFilter);

  if (filtered.length === 0) {
    noArticlesEl.hidden = false;
    return;
  }

  noArticlesEl.hidden = true;

  filtered.forEach((article) => {
    articlesListEl.appendChild(createArticleCard(article));
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".article-card").forEach((card) => {
      requestAnimationFrame(() => card.classList.add("is-visible"));
    });
  });
}

fetch("../data/articles.json")
  .then((res) => res.json())
  .then((data) => {
    allArticles = data;
    renderArticles();
  })
  .catch((err) => {
    console.error("خطا در دریافت مقاله‌ها:", err);
    noArticlesEl.hidden = false;
    noArticlesEl.querySelector("span").textContent =
      "مشکلی در دریافت مقاله‌ها پیش آمد.";
  });

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    renderArticles();
  });
});

const staticReveals = document.querySelectorAll(
  ".articles-hero.reveal, .filter-bar.reveal, .articles-section.reveal",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {threshold: 0.1},
);

staticReveals.forEach((el) => revealObserver.observe(el));
