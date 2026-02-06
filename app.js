const grid = document.getElementById("grid");
const empty = document.getElementById("empty");

// Modal
const modal = document.getElementById("modal");
const mPoster = document.getElementById("mPoster");
const mTitle = document.getElementById("mTitle");
const mActions = document.getElementById("mActions");
const closeBtn = document.getElementById("close");
const backdrop = document.getElementById("backdrop");

fetch("data/movies.json", { cache: "no-store" })
  .then(r => r.json())
  .then(movies => {
    if (!Array.isArray(movies)) throw new Error("movies.json no es una lista");

    movies.sort((a,b) => (a.year||0)-(b.year||0)); // cronológico
    render(movies);
  })
  .catch(err => {
    console.error(err);
    empty.classList.remove("hidden");
    empty.textContent = "Error cargando movies.json: " + err.message;
  });

function render(movies){
  grid.innerHTML = "";
  if (!movies.length) {
    empty.classList.remove("hidden");
    empty.textContent = "No hay películas en movies.json";
    return;
  }
  empty.classList.add("hidden");

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="posterWrap">
        <img src="${escapeAttr(movie.poster||"")}" alt="${escapeAttr(movie.title||"")}" loading="lazy">
      </div>
      <div class="cardBody">
        <p class="cardTitle">${escapeHtml(movie.title||"Sin título")}</p>
        <div class="cardMeta">
          <span class="pill">${escapeHtml(String(movie.year||""))}</span>
          <span class="pill">${escapeHtml(movie.playlist||"")}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => {
  window.location.href = "movie.html?id=" + movie.id;
});
grid.appendChild(card);

  });
}

function openModal(movie){
  const players = Array.isArray(movie.players) ? movie.players : [];

  mPoster.src = movie.poster || "";
  mPoster.alt = movie.title || "";
  mTitle.textContent = movie.title || "";

  mActions.innerHTML = "";

  if (!players.length) {
    const p = document.createElement("div");
    p.textContent = "Sin enlaces todavía.";
    mActions.appendChild(p);
  } else {
    players.forEach((pl, i) => {
      const a = document.createElement("a");
      a.className = "btnLink " + (i === 0 ? "primary" : "ghost");
      a.textContent = pl.label || "Ver";
      a.href = pl.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (!pl.url) {
        a.style.opacity = ".5";
        a.style.pointerEvents = "none";
      }
      mActions.appendChild(a);
    });
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}
function escapeAttr(str){ return escapeHtml(str); }
