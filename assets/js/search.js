// Client-side Search and Filter
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.getElementById('posts-container');
    const categorySelect = document.getElementById('category-filter');

    let allPosts = [];

    // Check if BLOG_POSTS is defined (from js/posts-data.js)
    if (typeof BLOG_POSTS !== 'undefined') {
        allPosts = BLOG_POSTS;
        renderPosts(allPosts);
        populateCategories(allPosts);
    } else {
        // Fallback for fetch if needed (though we're using the JS file now)
        fetch('data/posts.json')
            .then(response => response.json())
            .then(posts => {
                allPosts = posts;
                renderPosts(allPosts);
                populateCategories(allPosts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                postsContainer.innerHTML = '<p class="text-secondary">Error loading posts. Please check console.</p>';
            });
    }

    // Render posts to the container
    function renderPosts(posts) {
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-secondary">No posts found matching your criteria.</p>';
            return;
        }

        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'card';
            article.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <span class="badge" style="color: var(--accent-color); border-color: var(--accent-color);">${post.category}</span>
                    <span style="font-size: 0.8em; color: var(--text-secondary);">${post.date}</span>
                </div>
                <h3 style="margin: 0.5rem 0;"><a href="${post.url}">${post.title}</a></h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${post.summary}</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${post.tags.map(tag => `<span class="badge">#${tag}</span>`).join('')}
                </div>
            `;
            postsContainer.appendChild(article);
        });
    }

    // Populate category dropdown
    function populateCategories(posts) {
        const categories = [...new Set(posts.map(post => post.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Filter Logic
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilter = categorySelect.value;

        const filteredPosts = allPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                post.summary.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        renderPosts(filteredPosts);
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterPosts);
    if (categorySelect) categorySelect.addEventListener('change', filterPosts);
});
