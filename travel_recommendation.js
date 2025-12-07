document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the home page
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  if (searchBtn && clearBtn) {
    // Setup search button event
    searchBtn.addEventListener("click", handleSearch);

    // Setup clear button event
    clearBtn.addEventListener("click", clearResults);

    // Allow Enter key to trigger search
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

  // Setup contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});

async function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const keyword = searchInput.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("results");

  if (!keyword) {
    resultsContainer.innerHTML =
      '<p class="no-results">Please enter a search keyword (beach, temple, or country)</p>';
    return;
  }

  // Clear previous results
  resultsContainer.innerHTML = '<div class="loading">Searching...</div>';

  try {
    // Fetch the JSON data
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    let recommendations = [];

    // Check for beach variations
    if (keyword.includes("beach") || keyword === "beaches") {
      recommendations = data.beaches;
      resultsContainer.innerHTML = `<h2>Recommended Beaches (${recommendations.length} found)</h2>`;
    }
    // Check for temple variations
    else if (keyword.includes("temple") || keyword.includes("temple")) {
      recommendations = data.temples;
      resultsContainer.innerHTML = `<h2>Recommended Temples (${recommendations.length} found)</h2>`;
    }
    // Check for country variations
    else if (keyword.includes("country") || keyword.includes("countries")) {
      // For countries, we need to flatten the cities array
      recommendations = data.countries.flatMap((country) => country.cities);
      resultsContainer.innerHTML = `<h2>Recommended Countries & Cities (${recommendations.length} found)</h2>`;
    } else {
      resultsContainer.innerHTML =
        '<p class="no-results">No recommendations found for your search. Try "beach", "temple", or "country".</p>';
      return;
    }

    // Display recommendations
    if (recommendations.length === 0) {
      resultsContainer.innerHTML =
        '<p class="no-results">No recommendations found for your search.</p>';
      return;
    }

    recommendations.forEach((item) => {
      const card = document.createElement("div");
      card.className = "recommendation-card";

      card.innerHTML = `
              <img src="${item.imageUrl}" alt="${item.name}">
              <div class="recommendation-info">
                  <h3>${item.name}</h3>
                  <p>${item.description}</p>
                  <button class="visit-btn" onclick="handleVisit('${item.name}')">Visit</button>
              </div>
          `;

      resultsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    resultsContainer.innerHTML =
      '<p class="error">Error loading recommendations. Please try again.</p>';
  }
}

function handleVisit(destination) {
  alert(
    `You selected: ${destination}\n\nIn a real application, this would navigate to more details about ${destination}`
  );
  // In a real app, you would redirect to a details page
  // window.location.href = `destination.html?name=${encodeURIComponent(destination)}`;
}

function clearResults() {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  if (searchInput) searchInput.value = "";
  if (resultsContainer) resultsContainer.innerHTML = "";
}

function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Basic validation
  if (!name || !email || !message) {
    alert("Please fill in all fields");
    return;
  }

  // In a real application, you would send this data to a server
  console.log("Contact Form Submission:", { name, email, message });

  // Show success message
  alert("Thank you for your message! We will get back to you soon.");

  // Reset form
  event.target.reset();
}

// Optional: Country time display function (for Task 10)
function getCountryTime(timeZone) {
  const options = {
    timeZone: timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date().toLocaleTimeString("en-US", options);
}
