const CRYPTO_CURRENCY_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

async function fetchAPI(url) {
  try {
    const data = await fetch(url);
    if (data.status === "404") {
      const dataJson = await data.json();
      return dataJson;
    } else {
      throw Error("404");
    }
  } catch (error) {
    console.log(error);
  }
}

let cryptoCurrenciesArray = [];
let watchListArray = [];
let favoriteCoinsIDs = [];
let isFavorite = false;
let searchedValue;

async function updateWatchListArray() {
  try {
    if (cryptoCurrenciesArray) {
      watchListArray = cryptoCurrenciesArray.filter((cryptoCurrency) => {
        return favoriteCoinsIDs.includes(cryptoCurrency.id);
      });
    } else {
      throw Error("failed to fetch data!");
    }
  } catch (error) {
    console.log(error);
  }
}

function updateWatchListDOM(cryptoCurrenciesArray) {
  const cryptoCurrencies = cryptoCurrenciesArray
    .sort(function (a, b) {
      return a.market_cap_rank - b.market_cap_rank;
    })
    .map((cryptoCurrency) => {
      isFavorite = favoriteCoinsIDs.includes(cryptoCurrency.id);
      return `
            <tr class="fav-coin" data-id="${cryptoCurrency.id}">
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
                
                <td class="text-center fw-bold">$${Number(
                  cryptoCurrency.current_price
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</td>
                <td class="text-left fw-bold ${
                  Number(cryptoCurrency.price_change_percentage_24h) < 0
                    ? " text-danger"
                    : "text-success"
                }">
                ${Number(cryptoCurrency.price_change_percentage_24h).toFixed(
                  2
                )}%
                </td>
                <td class="text-left font-weight-bold">$${Number(
                  cryptoCurrency.high_24h
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</td>
                  <td class="text-left font-weight-bold">$${Number(
                    cryptoCurrency.low_24h
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</td>
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
      const useTag = event.target.firstElementChild;
      const svgTag = event.target.closest("svg");
      useTag.setAttribute("xlink:href", "#star");
      svgTag.style.fill = "currentColor";
      const removeIndex = favoriteCoinsIDs.findIndex(
        (id) => id === favoriteCoinID
      );
      removeFavoriteCoinToLocalStorage(removeIndex);
      updateFavoriteCoinsIDsFromLocalStorage();
      updateWatchListArray();
      updateWatchListDOM(watchListArray);
    });
  });
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
  searchedValue = event.target.value.toLowerCase();
  filterAndUpdate();
}

function filterAndUpdate() {
  if (!searchedValue || searchedValue === "") {
    updateDOM(cryptoCurrenciesArray);
    return;
  }
  const CryptoCurrencyToShow = cryptoCurrenciesArray.filter(
    (cryptoCurrency) =>
      cryptoCurrency.name.toLowerCase().includes(searchedValue) ||
      cryptoCurrency.symbol.toLowerCase().includes(searchedValue)
  );
  updateWatchListDOM(CryptoCurrencyToShow);
}

async function fetchAndUpdate() {
  cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL);
  filterAndUpdate(cryptoCurrenciesArray);
}

document.addEventListener("DOMContentLoaded", async () => {
  updateFavoriteCoinsIDsFromLocalStorage();
  try {
    cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL);

    if (cryptoCurrenciesArray) {
      updateWatchListArray();
      updateWatchListDOM(watchListArray);
    } else {
      throw Error("failed to fetch data!");
    }
  } catch (error) {
    console.log(error);
  }
  searchCoinInput.addEventListener("input", searchCoins);
  searchCoinForm.addEventListener("submit", (e) => e.preventDefault());
  //   refresh every 1 min
  setInterval(() => {
    fetchAndUpdate();
  }, 60000);
});
