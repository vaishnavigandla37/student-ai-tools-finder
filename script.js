const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const pricingFilter = document.getElementById("pricingFilter");
const toolsGrid = document.getElementById("toolsGrid");
const status = document.getElementById("status");
const refreshBtn = document.getElementById("refreshBtn");
const statsTools = document.getElementById("statsTools");

const state = {
  tools: [],
};

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getPricingClass(value = "Free") {
  const normalized = String(value).trim();

  if (normalized.toLowerCase() === "free") return "free";
  if (normalized.toLowerCase() === "freemium") return "freemium";
  if (normalized.toLowerCase() === "paid") return "paid";

  return "free";
}

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
    statsTools.textContent = state.tools.length;
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
    .map((tool) => {
      const categoryClass = `category-${slugify(tool.category || "General")}`;
      const pricingClass = `pricing-${getPricingClass(tool.pricing || "Free")}`;

      return `
        <article class="tool-card ${categoryClass}">
          <div class="card-top">
            <span class="category-pill">${tool.category}</span>
            <span class="pricing-pill ${pricingClass}">${tool.pricing || "Free"}</span>
          </div>

          <h3>${tool.name}</h3>
          <p>${tool.description}</p>

          <div class="tool-meta">
            <span class="meta-label">Best for</span>
            <span>${tool.bestFor}</span>
          </div>

          <a class="tool-link" href="${tool.url}" target="_blank" rel="noopener noreferrer">
            Open tool <span aria-hidden="true">↗</span>
          </a>
        </article>
      `;
    })
    .join("");
}

searchInput.addEventListener("input", renderTools);
categoryFilter.addEventListener("change", renderTools);
pricingFilter.addEventListener("change", renderTools);
refreshBtn.addEventListener("click", fetchTools);

fetchTools();
