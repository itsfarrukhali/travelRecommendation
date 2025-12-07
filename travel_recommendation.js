function search() {
  const keyword = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // clear old results

  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
    return;
  }

  fetch("travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      let results = [];

      if (keyword.includes("beach")) {
        results = data.beaches;
      } else if (keyword.includes("temple")) {
        results = data.temples;
      } else if (keyword.includes("country")) {
        results = data.countries;
      } else {
        resultsDiv.innerHTML = "<p>No matching category found.</p>";
        return;
      }

      results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
                  <img src="${item.imageUrl}">
                  <div>
                      <h3>${item.name}</h3>
                      <p>${item.description}</p>
                      ${
                        item.timezone
                          ? `<p><b>Current Time:</b> ${getTime(
                              item.timezone
                            )}</p>`
                          : ""
                      }
                  </div>
              `;

        resultsDiv.appendChild(card);
      });
    });
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("searchInput").value = "";
}

function getTime(tz) {
  const options = {
    timeZone: tz,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date().toLocaleTimeString("en-US", options);
}
