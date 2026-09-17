const ARTICLE_COVER_BASE = "../shared/images/articles/";

const newsListEl = document.getElementById("news-list");

function createArticleCard(article) {
  const card = document.createElement("article");
  card.className = "news-card reveal";

  card.innerHTML = `
    <a href="pages/article.html?id=${article.id}" class="news-card-link">
      <div class="news-card-cover">
        <img src="${ARTICLE_COVER_BASE}${article.cover}" alt="${article.title}" loading="lazy" />
      </div>

      <div class="news-card-body">
        <span class="news-card-category">${article.category}</span>
        <h3 class="news-card-title">${article.title}</h3>
        <p class="news-card-excerpt">${article.excerpt}</p>
        <time class="news-card-date" datetime="${article.date}">${article.date}</time>
      </div>
    </a>
  `;

  return card;
}

fetch("data/articles.json")
  .then((res) => res.json())
  .then((articles) => {
    if (!articles || articles.length === 0) {
      newsListEl.innerHTML = `
        <div class="no-articles">
          <span>هنوز مقاله‌ای منتشر نشده است.</span>
        </div>
      `;
      return;
    }

    const preview = articles.slice(0, 3);

    preview.forEach((article) => {
      newsListEl.appendChild(createArticleCard(article));
    });

    const revealEls = newsListEl.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  })
  .catch((err) => {
    console.error("خطا در دریافت مقاله‌ها:", err);
    newsListEl.innerHTML = `
      <div class="no-articles">
        <span>مشکلی در دریافت مقاله‌ها پیش آمد.</span>
      </div>
    `;
  });