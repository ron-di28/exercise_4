const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  let resultsContainer = document.getElementById('resultsImageContainer');
  resultsContainer.innerHTML = '';

  let searchInput = document.querySelector('.search input');
  let query = searchInput.value;
  let url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;
  let request = new XMLHttpRequest();

  request.open('GET', url, true);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function() {
    if (request.status >= 200 && request.status < 300) {
      let data = request.response;
      displayResults(data);
    } else {
      console.error("Error:", request.statusText);
    }
  };

  request.send(); 
  openResultsPane();


  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function displayResults(data) {
  let resultsContainer = document.getElementById('resultsImageContainer');
  
  data.value.forEach(image => {
    let imgElement = document.createElement('img');
    imgElement.src = image.contentUrl;
    imgElement.alt = image.name;
    
    imgElement.addEventListener('click', function() {
      addToMoodBoard(image.contentUrl, image.name);
    });

    resultsContainer.appendChild(imgElement);
  });

  displayRelatedSearches(data.relatedSearches);
}

function addToMoodBoard(imageUrl, imageName) {
  let board = document.getElementById('board');
  let imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  imgElement.alt = imageName;

  let container = document.createElement('div');
  container.className = 'savedImage';
  container.appendChild(imgElement);

  board.appendChild(container);
}

function displayRelatedSearches(relatedSearches) {
  if (!relatedSearches) return; 

  let relatedSearchesContainer = document.getElementById('relatedSearchesContainer'); 
  relatedSearchesContainer.innerHTML = '';

  relatedSearches.forEach(search => {
    let searchElement = document.createElement('li');
    searchElement.textContent = search.text;

    searchElement.addEventListener('click', function() {
      performNewSearch(search.text);
    });

    relatedSearchesContainer.appendChild(searchElement);
  });
}

function performNewSearch(query) {
  let searchInput = document.querySelector('.search input'); 
  searchInput.value = query;
  runSearch();
}



function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");

}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
