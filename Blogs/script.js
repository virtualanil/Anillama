// Complete 10 Blog Posts Data Array (Strictly using YOUR original data)
const blogs = [
    {
        id: 1,
        title: "Top 10 AI Tools for App Developers",
        description: "Discover the best AI tools to speed up your app development workflow.",
        slug: "Top-10-AI-Tools",
        category: "AI Tools",
        date: "August 2026",
        readTime: "12 min read",
        icon: "🚀",
        featured: true // Hero section
    },    
    {
        id: 2,
        title: "AI for App Building",
        description: "Discover how AI tools are transforming modern app development.",
        slug: "AI-for-App-Building",
        category: "Development By AI",
        date: "August 2026",
        readTime: "12 min read",
        icon: "🚀",
        featured: false
    },    
    {
        id: 3,
        title: "What Are Large Language Models (LLMs)? A Complete Beginner's Guide",
        description: "Power of a Large Language Model (LLM).",
        slug: "LLMs-A-Beginner's Guide",
        category: "AI Trends",
        date: "July 21, 2026",
        readTime: "15 min read",
        icon: "💡",
        featured: false
    },    
    {
        id: 4,
        title: "How Machine Learning Works with Real Examples",
        description: "Every time you unlock your phone with your face, scroll through personalized video recommendations on YouTube, or receive a text message warning you about a suspicious credit card transaction, you are interacting with Machine Learning (ML).",
        slug: "Machine-Learning-Works",
        category: "AI Basics",
        date: "July 2026",
        readTime: "10 min read",
        icon: "⚙",
        featured: false
    },
    {
        id: 5,
        title: "Install and Set Up Nepali Unicode Keyboard on Windows, Mac, Android, and iOS",
        description: "A complete, multi-platform guide to setting up native Devanagari typing on all your devices. Learn how to enable system-level language packs, switch between Traditional and Romanized layouts, master keyboard shortcuts, and fix common rendering glitches on Windows, Mac, Android, and iOS.",
        slug: "Set-Up-Nepali-Unicode-Keyboard",
        category: "Setup",
        date: "July 2026",
        readTime: "8 min read",
        icon: "🔑",
        featured: false
    },
    {
        id: 6,
        title: "AI Automation with n8n – Complete Beginner Guide",
        description: "Learn how to automate repetitive tasks using AI, APIs, Google Sheets, and n8n workflows.",
        slug: "ai-automation-with-n8n",
        category: "Automation",
        date: "July 2026",
        readTime: "8 min read",
        icon: "🤖",
        featured: false
    },
    {
        id: 7,
        title: "What is AI? A Beginner's Guide",
        description: "A complete breakdown of Artificial Intelligence, Machine Learning, and Generative AI for total beginners.",
        slug: "what-is-ai",
        category: "AI Basics",
        date: "July 21, 2026",
        readTime: "6 min read",
        icon: "💡",
        featured: false
    },
    {
        id: 8,
        title: "How AI is Growing in the World",
        description: "Discover how Artificial Intelligence is transforming major global industries, workforce dynamics, and the future economy.",
        slug: "how-ai-is-growing-in-the-world",
        category: "AI Trends",
        date: "July 2026",
        readTime: "7 min read",
        icon: "🌐",
        featured: false
    },
    {
        id: 9,
        title: "AI for Data Analysis: A Complete Beginner's Guide & Key Learnings",
        description: "Discover how Artificial Intelligence is transforming major global industries, workforce dynamics, and the future economy.",
        slug: "AI-for-Data-Analysis",
        category: "AI Trends",
        date: "August 2026",
        readTime: "10 min read",
        icon: "🎓",
        featured: false
    },
    {
        id: 10,
        title: "Best AI Tools for Students in 2026",
        description: "Boost your productivity with top AI tools for research, literature review, writing, coding, and exam preparation.",
        slug: "best-ai-tools-for-students",
        category: "Productivity",
        date: "July 2026",
        readTime: "5 min read",
        icon: "🎓",
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
    if(searchInput) searchInput.addEventListener("input", handleSearch);
    if(clearSearchBtn) clearSearchBtn.addEventListener("click", clearSearch);
    if(sortSelect) sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderBlogs();
    });
    if(themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
});

// Helper: Check if date is recent (New tag within 30 days)
function isNew(dateString) {
    const blogDate = new Date(dateString);
    const now = new Date("2026-08-08"); // Current date reference for logic
    const diffDays = (now - blogDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30; // 30 days time window for "NEW"
}

// Render Categories with Count Badges
function renderCategories() {
    if(!categoryContainer) return;
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
    if(clearSearchBtn) clearSearchBtn.style.display = searchQuery ? "block" : "none";
    renderBlogs();
}

function clearSearch() {
    searchInput.value = "";
    searchQuery = "";
    if(clearSearchBtn) clearSearchBtn.style.display = "none";
    renderBlogs();
}

// Render Featured & Grid Blogs
function renderBlogs() {
    if(!blogGrid) return;
    
    // 1. Filter Blogs
    let filtered = blogs.filter(blog => {
        const matchesCategory = currentCategory === "All" || blog.category === currentCategory;
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery) || 
                              blog.description.toLowerCase().includes(searchQuery); // Changed from summary to description
        return matchesCategory && matchesSearch;
    });

    // 2. Sort Blogs
    filtered.sort((a, b) => {
        if (currentSort === "newest") return new Date(b.date) - new Date(a.date);
        if (currentSort === "oldest") return new Date(a.date) - new Date(b.date);
        if (currentSort === "readTime") return parseInt(a.readTime) - parseInt(b.readTime);
        if (currentSort === "az") return a.title.localeCompare(b.title);
    });

    // 3. Render Featured Banner (Only when in 'All' category & no active search)
    const featured = blogs.find(b => b.featured);
    if (featuredContainer) {
        if (featured && currentCategory === "All" && !searchQuery) {
            featuredContainer.innerHTML = `
                <div class="featured-card">
                    <div class="featured-content">
                        <span class="featured-badge">Featured Post</span>
                        <h1>${featured.title}</h1>
                        <p>${featured.description}</p>
                        <div class="meta-info">
                            <span><i class="fa-regular fa-calendar"></i> ${featured.date}</span>
                            <span><i class="fa-regular fa-clock"></i> ${featured.readTime}</span>
                        </div>
                        <br>
                        <a href="${featured.slug}" target="_blank" style="color: var(--accent); font-weight: bold; text-decoration: none;">Read Article <i class="fa-solid fa-arrow-right"></i></a>
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
    }

    // 4. Update Article Counter
    if(articleCount) {
        articleCount.textContent = `Showing ${filtered.length} article${filtered.length !== 1 ? 's' : ''}`;
    }

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
                <h3>${blog.icon} ${blog.title}</h3>
                <p>${blog.description}</p>
            </div>
            <div class="card-footer">
                <div>
                    <span><i class="fa-regular fa-calendar"></i> ${blog.date}</span>
                    <span style="margin-left: 10px;"><i class="fa-regular fa-clock"></i> ${blog.readTime}</span>
                </div>
                <a href="${blog.slug}" target="_blank" style="color: var(--accent); font-weight: 700; text-decoration: none; font-size: 0.9rem;">Read <i class="fa-solid fa-arrow-right"></i></a>
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
    if(toast) {
        toast.textContent = `Link copied for "${title.substring(0, 20)}..." 🚀`;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
}

// Theme Switcher Logic
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
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
    if(!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === "dark" 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}
