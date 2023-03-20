const CRYPTO_CURRENCY_API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

async function fetchAPI(url) {
  const data = await fetch(url);
  const dataJson = await data.json();
  console.log(dataJson);
  return dataJson;
}

let cryptoCurrenciesArray = [];

function updateDOM() {
  const cryptoCurrencies = cryptoCurrenciesArray
    .map((cryptoCurrency) => {
      return `
            <tr>
                <td>
                  <div class="d-flex align-items-center justify-content-center">
                    <div>
                      <svg width="16" height="16" fill="currentColor" class="bi bi-star" style="cursor: pointer;"><use xlink:href="#star"></use></svg>
                    </div>
                  </div>
                </td>
                <th scope="row" class="text-left">${
                  cryptoCurrency.market_cap_rank
                }</th>
                <td class="text-left"><img src="${
                  cryptoCurrency.image
                }" class="crypto-img"></td>
                <td class="text-left font-weight-bold" colspan="2">${
                  cryptoCurrency.name
                }</td>
                <td 
                  class="
                    text-center 
                    text-uppercase 
                    font-weight-bold 
                    text-secondary
                  "
                >
                ${cryptoCurrency.symbol}
                </td>
                <td class="text-center font-weight-bold">$${Number(
                  cryptoCurrency.current_price
                ).toLocaleString()}</td>
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
}

document.addEventListener("DOMContentLoaded", async () => {
  cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL);
  updateDOM();

  //   refresh every 1 min
  setInterval(async () => {
    cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL);
    updateDOM();
  }, 60000);
});
