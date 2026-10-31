const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const pricingFilter = document.getElementById("pricingFilter");
const toolsGrid = document.getElementById("toolsGrid");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");

const state = {
  tools: [],
};

async function fetchTools() {
  try {
    status.textContent = "Loading AI tools...";
    const response = await fetch("./tools.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load tool list.");
    }

    const data = await response.json();
    state.tools = Array.isArray(data) ? data : [];
    renderTools();
    status.textContent = `Showing ${state.tools.length} AI tools for students.`;
  } catch (error) {
    status.textContent = "Could not fetch the tool list. Please try again.";
    console.error(error);
  }
}

function getFilteredTools() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPricing = pricingFilter.value;

  return state.tools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;

    const matchesPricing =
      selectedPricing === "all" || (tool.pricing || "Free") === selectedPricing;

    const searchText = [
      tool.name,
      tool.description,
      tool.bestFor,
      tool.category,
      tool.pricing,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchValue || searchText.includes(searchValue);

    return matchesCategory && matchesPricing && matchesSearch;
  });
}

function renderTools() {
  const filteredTools = getFilteredTools();

  if (filteredTools.length === 0) {
    toolsGrid.innerHTML = `
      <div class="empty-state">
        No tools match your search. Try another keyword, category, or pricing option.
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
            <span class="free-pill">${tool.pricing || "Free"}</span>
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
pricingFilter.addEventListener("change", renderTools);
refreshBtn.addEventListener("click", fetchTools);

fetchTools();
