const ARTICLE_COVER_BASE = "../../shared/images/articles/";

const viewEl = document.getElementById("article-view");
const relatedSection = document.getElementById("related-section");
const relatedGrid = document.getElementById("related-grid");

const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

const NOT_FOUND_PATH = "../../404.html";

// نمایش کارت لودینگ مشترک همین ابتدای کار
SoldierLoading.show({ logo: "../../shared/images/logo/logo-long.png" });

function redirectToNotFound() {
  window.location.href = NOT_FOUND_PATH;
}

function renderArticle(article, allArticles) {
  SoldierLoading.hide();
  viewEl.hidden = false;

  document.getElementById("page-title").textContent =
    `${article.title} - سرباز بازی مرکب`;

  document.getElementById("article-cover-img").src =
    `${ARTICLE_COVER_BASE}${article.cover}`;
  document.getElementById("article-cover-img").alt = article.title;

  document.getElementById("article-category").textContent = article.category;
  document.getElementById("article-title").textContent = article.title;
  document.getElementById("article-author").textContent =
    article.author || "تیم سرباز";
  document.getElementById("article-date").textContent = article.date;
  document.getElementById("article-date").setAttribute("datetime", article.date);

  const bodyEl = document.getElementById("article-body");
  const paragraphs = article.content && article.content.length
    ? article.content
    : [article.excerpt || ""];

  bodyEl.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");

  const related = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  if (related.length > 0) {
    relatedSection.hidden = false;
    relatedGrid.innerHTML = related
      .map(
        (a) => `
          <a href="article.html?id=${a.id}" class="related-card">
            <div class="related-card-cover">
              <img src="${ARTICLE_COVER_BASE}${a.cover}" alt="${a.title}" loading="lazy" />
            </div>
            <div class="related-card-title">${a.title}</div>
          </a>
        `
      )
      .join("");
  }
}

if (!articleId) {
  redirectToNotFound();
} else {
  fetch("../data/articles.json")
    .then((res) => res.json())
    .then((allArticles) => {
      const article = allArticles.find((a) => a.id === articleId);

      if (!article) {
        redirectToNotFound();
        return;
      }

      renderArticle(article, allArticles);
    })
    .catch((err) => {
      console.error("خطا در دریافت مقاله:", err);
      redirectToNotFound();
    });
}