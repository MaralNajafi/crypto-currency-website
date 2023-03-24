const CRYPTO_CURRENCY_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

async function fetchAPI(url) {
  const data = await fetch(url);
  const dataJson = await data.json();
  console.log(dataJson);
  return dataJson;
}

let cryptoCurrenciesArray = [];
let favoriteCoinsIDs = [];
let isFavorite = false;

function updateDOM(cryptoCurrenciesArray) {
  const cryptoCurrencies = cryptoCurrenciesArray
    .map((cryptoCurrency) => {
      isFavorite = favoriteCoinsIDs.includes(cryptoCurrency.id);
      return `
            <tr>
                <td>
                  <div class="d-flex align-items-center justify-content-end">
                    <button class="fav-icon reset-btn" data-id="${
                      cryptoCurrency.id
                    }">
                      <svg 
                      width="16" 
                      height="16" 
                      fill=${isFavorite ? "#ffc107" : "currentColor"} 
                      class="bi bi-star" 
                      style="cursor: pointer";>
                        <use style="pointer-events: none;" xlink:href=${
                          isFavorite ? "#star-fill" : "#star"
                        }></use>
                      </svg>
                    </button>
                  </div>
                </td>
                <th scope="row" class="text-center">
                ${cryptoCurrency.market_cap_rank}
                </th>
                <td class="text-left font-weight-bold" colspan="2">
                  <img src="${cryptoCurrency.image}" class="crypto-img pe-2">
                  ${cryptoCurrency.name} 
                  <span class="fs-6 text-uppercase text-secondary fw-light">
                  ${cryptoCurrency.symbol}
                  </span>
                </td>
                
                <td class="text-center font-weight-bold">$${Number(
                  cryptoCurrency.current_price
                )
                  .toFixed(2)
                  .toLocaleString()}</td>
                <td class="text-left ${
                  Number(cryptoCurrency.price_change_percentage_24h) < 0
                    ? " text-danger"
                    : "text-success"
                }">
                ${Number(cryptoCurrency.price_change_percentage_24h).toFixed(
                  2
                )}%
                </td>
            </tr>
        `;
    })
    .join("");

  document.getElementById("root").innerHTML = cryptoCurrencies;
  addEventListenerToFavIcons();
}

function addEventListenerToFavIcons() {
  const favIcons = document.querySelectorAll(".fav-icon");
  favIcons.forEach((favIcon) => {
    favIcon.addEventListener("click", (event) => {
      const favoriteCoinID = event.target.closest("button").dataset.id;
      isFavorite = favoriteCoinsIDs.includes(favoriteCoinID);
      const useTag = event.target.firstElementChild;
      const svgTag = event.target.closest("svg");
      if (isFavorite) {
        const removeIndex = favoriteCoinsIDs.findIndex(
          (id) => id === favoriteCoinID
        );
        removeFavoriteCoinToLocalStorage(removeIndex);
        useTag.setAttribute("xlink:href", "#star");
        svgTag.style.fill = "currentColor";
        return;
      } else {
        addFavoriteCoinToLocalStorage(favoriteCoinID);
        useTag.setAttribute("xlink:href", "#star-fill");
        svgTag.style.fill = "#ffc107";
      }
    });
  });
}

function addFavoriteCoinToLocalStorage(favoriteCoinID) {
  favoriteCoinsIDs.push(favoriteCoinID);
  localStorage.setItem("favoriteCoinsIDs", favoriteCoinsIDs);
}

function removeFavoriteCoinToLocalStorage(removeIndex) {
  favoriteCoinsIDs.splice(removeIndex, 1);
  localStorage.setItem("favoriteCoinsIDs", favoriteCoinsIDs);
}

function updateFavoriteCoinsIDsFromLocalStorage() {
  const localStorageFavoriteCoinsIDs = localStorage.getItem("favoriteCoinsIDs");
  favoriteCoinsIDs = localStorageFavoriteCoinsIDs
    ? localStorageFavoriteCoinsIDs.split(",")
    : [];
}

/* Search Coins */
//DOM variables
const searchCoinForm = document.getElementById("search-coin-form");
const searchCoinInput = document.getElementById("search-coin-input");

function searchCoins(event) {
  const searchedValue = event.target.value;
  const CryptoCurrencyToShow = cryptoCurrenciesArray.filter(
    (cryptoCurrency) =>
      cryptoCurrency.name.toLowerCase().includes(searchedValue) ||
      cryptoCurrency.symbol.toLowerCase().includes(searchedValue)
  );
  updateDOM(CryptoCurrencyToShow);
}

async function fetchAndUpdate() {
  cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL);
  updateDOM(cryptoCurrenciesArray);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndUpdate();
  updateFavoriteCoinsIDsFromLocalStorage();
  searchCoinInput.addEventListener("input", searchCoins);
  searchCoinForm.addEventListener("submit", (e) => e.preventDefault());
  //   refresh every 1 min
  setInterval(async () => {
    fetchAndUpdate();
  }, 60000);
});
