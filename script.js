const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toolsGrid = document.getElementById("toolsGrid");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");

const state = {
  tools: [],
};

async function fetchTools() {
  try {
    status.textContent = "Loading free AI tools...";
    const response = await fetch("./tools.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load tool list.");
    }

    const data = await response.json();
    state.tools = data;
    renderTools();
    status.textContent = `Showing ${data.length} free AI tools for students.`;
  } catch (error) {
    status.textContent = "Could not fetch the tool list. Please try again.";
    console.error(error);
  }
}

function getFilteredTools() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  return state.tools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;

    const searchText = [
      tool.name,
      tool.description,
      tool.bestFor,
      tool.category,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchValue || searchText.includes(searchValue);

    return matchesCategory && matchesSearch;
  });
}

function renderTools() {
  const filteredTools = getFilteredTools();

  if (filteredTools.length === 0) {
    toolsGrid.innerHTML = `
      <div class="empty-state">
        No tools match your search. Try another keyword or category.
      </div>
    `;
    return;
  }

  toolsGrid.innerHTML = filteredTools
    .map(
      (tool) => `
        <article class="tool-card">
          <div class="card-top">
            <span class="category-pill">${tool.category}</span>
            <span class="free-pill">Free</span>
          </div>

          <h3>${tool.name}</h3>
          <p>${tool.description}</p>

          <ul>
            <li><strong>Best for:</strong> ${tool.bestFor}</li>
          </ul>

          <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
            Open tool
          </a>
        </article>
      `
    )
    .join("");
}

searchInput.addEventListener("input", renderTools);
categoryFilter.addEventListener("change", renderTools);
refreshBtn.addEventListener("click", fetchTools);

fetchTools();
