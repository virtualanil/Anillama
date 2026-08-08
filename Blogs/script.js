// Sample Blog Data Array
const blogs = [
    {
        id: 1,
        title: "Top AI Automation Tools to Master in August 2026",
        category: "AI Tools",
        date: "2026-08-05",
        readTime: "5 min read",
        summary: "Discover cutting-edge workflow automation platforms transforming modern software development and digital productivity.",
        icon: "🤖",
        featured: true
    },
    {
        id: 2,
        title: "Building Modern Responsive UIs with Pure CSS",
        category: "Web Dev",
        date: "2026-07-28",
        readTime: "8 min read",
        summary: "Learn container queries, modern layout techniques, and smooth glassmorphism effects without heavy frameworks.",
        icon: "🎨",
        featured: false
    },
    {
        id: 3,
        title: "How Agentic AI Workflows Are Replacing Traditional Scripts",
        category: "AI Trends",
        date: "2026-08-01",
        readTime: "6 min read",
        summary: "Autonomous AI agents can now execute multi-step complex engineering pipelines with minimal human oversight.",
        icon: "⚡",
        featured: false
    },
    {
        id: 4,
        title: "10 Habits for Ultra-Productive Software Developers",
        category: "Productivity",
        date: "2026-06-15",
        readTime: "4 min read",
        summary: "Optimize your daily focus time, streamline context switches, and leverage intelligent coding assistants.",
        icon: "🎯",
        featured: false
    }
];

// State Variables
let currentCategory = "All";
let searchQuery = "";
let currentSort = "newest";
let bookmarkedIds = new Set();

// DOM Elements
const blogGrid = document.getElementById("blogGrid");
const featuredContainer = document.getElementById("featuredContainer");
const categoryContainer = document.getElementById("categoryContainer");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const sortSelect = document.getElementById("sortSelect");
const articleCount = document.getElementById("articleCount");
const themeToggleBtn = document.getElementById("themeToggle");
const toast = document.getElementById("toast");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderCategories();
    renderBlogs();

    // Event Listeners
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", clearSearch);
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderBlogs();
    });
    themeToggleBtn.addEventListener("click", toggleTheme);
});

// Helper: Check if date is recent (New tag)
function isNew(dateString) {
    const blogDate = new Date(dateString);
    const now = new Date("2026-08-08"); // Current date reference
    const diffDays = (now - blogDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 14; // Marked NEW if within 14 days
}

// Render Categories with Count Badges
function renderCategories() {
    const categories = ["All", ...new Set(blogs.map(b => b.category))];
    categoryContainer.innerHTML = categories.map(cat => {
        const count = cat === "All" ? blogs.length : blogs.filter(b => b.category === cat).length;
        return `
            <button class="pill ${cat === currentCategory ? 'active' : ''}" onclick="selectCategory('${cat}')">
                ${cat} (${count})
            </button>
        `;
    }).join("");
}

function selectCategory(cat) {
    currentCategory = cat;
    renderCategories();
    renderBlogs();
}

// Search Handler
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    clearSearchBtn.style.display = searchQuery ? "block" : "none";
    renderBlogs();
}

function clearSearch() {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderBlogs();
}

// Render Featured & Grid Blogs
function renderBlogs() {
    // 1. Filter Blogs
    let filtered = blogs.filter(blog => {
        const matchesCategory = currentCategory === "All" || blog.category === currentCategory;
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery) || 
                              blog.summary.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // 2. Sort Blogs (Date Wise: Newest First)
    filtered.sort((a, b) => {
        if (currentSort === "newest") return new Date(b.date) - new Date(a.date);
        if (currentSort === "oldest") return new Date(a.date) - new Date(b.date);
        if (currentSort === "readTime") return parseInt(a.readTime) - parseInt(b.readTime);
        if (currentSort === "az") return a.title.localeCompare(b.title);
    });

    // 3. Render Featured Banner (If 'All' category & no active search)
    const featured = blogs.find(b => b.featured);
    if (featured && currentCategory === "All" && !searchQuery) {
        featuredContainer.innerHTML = `
            <div class="featured-card">
                <div class="featured-content">
                    <span class="featured-badge">Featured Post</span>
                    <h1>${featured.title}</h1>
                    <p>${featured.summary}</p>
                    <div class="meta-info">
                        <span><i class="fa-regular fa-calendar"></i> ${featured.date}</span>
                        <span><i class="fa-regular fa-clock"></i> ${featured.readTime}</span>
                    </div>
                </div>
                <div class="featured-image-holder">
                    ${featured.icon}
                </div>
            </div>
        `;
        featuredContainer.style.display = "block";
    } else {
        featuredContainer.style.display = "none";
    }

    // 4. Update Article Counter
    articleCount.textContent = `Showing ${filtered.length} article${filtered.length !== 1 ? 's' : ''}`;

    // 5. Render Blog Grid Cards
    if (filtered.length === 0) {
        blogGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No articles found matching your query.</div>`;
        return;
    }

    blogGrid.innerHTML = filtered.map(blog => `
        <article class="blog-card">
            <div>
                <div class="card-top">
                    <div>
                        <span class="category-badge">${blog.category}</span>
                        ${isNew(blog.date) ? '<span class="new-tag">NEW</span>' : ''}
                    </div>
                    <div class="card-actions">
                        <button onclick="toggleBookmark(${blog.id})" title="Bookmark">
                            <i class="${bookmarkedIds.has(blog.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                        </button>
                        <button onclick="shareArticle('${blog.title}')" title="Share">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
                <h3>${blog.title}</h3>
                <p>${blog.summary}</p>
            </div>
            <div class="card-footer">
                <span><i class="fa-regular fa-calendar"></i> ${blog.date}</span>
                <span><i class="fa-regular fa-clock"></i> ${blog.readTime}</span>
            </div>
        </article>
    `).join("");
}

// Interactive Features
function toggleBookmark(id) {
    if (bookmarkedIds.has(id)) {
        bookmarkedIds.delete(id);
    } else {
        bookmarkedIds.add(id);
    }
    renderBlogs();
}

function shareArticle(title) {
    navigator.clipboard.writeText(window.location.href);
    toast.textContent = `Link copied for "${title.substring(0, 20)}..." 🚀`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Theme Switcher Logic
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === "dark" 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}
