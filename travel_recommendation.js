document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  searchBtn?.addEventListener("click", handleSearch);
  clearBtn?.addEventListener("click", clearResults);

  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});

async function handleSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("results");

  if (!keyword) {
    resultsContainer.classList.remove("active");
    resultsContainer.innerHTML = "";
    return;
  }

  resultsContainer.classList.add("active");
  resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

  try {
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    let recommendations = [];

    if (keyword.includes("beach") || keyword === "beaches") {
      recommendations = data.beaches;
    } else if (keyword.includes("temple")) {
      recommendations = data.temples;
    } else if (keyword.includes("country")) {
      recommendations = data.countries.flatMap((c) => c.cities);
    } else {
      resultsContainer.innerHTML =
        '<p class="no-results">No results — try "beach", "temple" or "country"</p>';
      return;
    }

    resultsContainer.innerHTML = "";
    recommendations.forEach((item) => {
      resultsContainer.innerHTML += `
        <div class="recommendation-card">
          <img src="${item.imageUrl}" alt="${item.name}">
          <div class="recommendation-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button class="visit-btn" onclick="handleVisit('${item.name}')">Visit</button>
          </div>
        </div>`;
    });
  } catch (err) {
    resultsContainer.innerHTML = "<p>Error loading data.</p>";
  }
}

function clearResults() {
  results.classList.remove("active");
  results.innerHTML = "";
  searchInput.value = "";
}

function handleVisit(destination) {
  alert(`You selected ${destination}`);
}
