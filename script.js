const postContainer = document.getElementById("post-container"),
  loading = document.querySelector(".loader"),
  filter = document.getElementById("filter"),
  popular = document.getElementById("popular"),
  latest = document.getElementById("latest");

let page = 0;
// show = search for popular , show = search_by_date for latest
let show = "search";

// Fetch posts from HN API
async function getPost() {
  const res = await fetch(
    `https://hn.algolia.com/api/v1/${show}?tags=story&page=${page}`
  );

  const data = await res.json();
  return data;
}

// Show HN posts in DOM
async function showPosts() {
  const HNPosts = await getPost();

  HNPosts.hits.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `
      <div class="number">${post.points}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.url}</p>
      </div>
    `;

    postContainer.appendChild(postEl);
  });
}

// Show loader & fetch more posts
function showLoading() {
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    setTimeout(() => {
      page++;
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const title = post.querySelector(".post-title").innerText.toUpperCase();
    const body = post.querySelector(".post-body").innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
}

// Handle Click
function handleClick(e) {
  const clicked = e.target.id;
  if (clicked === "popular") {
    show = "search";
    if (!popular.classList.contains("chosen")) {
      popular.classList.add("chosen");
      latest.classList.remove("chosen");
    }
  } else {
    show = "search_by_date";
    if (!latest.classList.contains("chosen")) {
      latest.classList.add("chosen");
      popular.classList.remove("chosen");
    }
  }
  postContainer.innerHTML = "";
  HNpage = 0;
  showPosts();
}

// Show initial posts
showPosts();

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    showLoading();
  }
});

filter.addEventListener("input", filterPosts);
popular.addEventListener("click", handleClick);
latest.addEventListener("click", handleClick);
