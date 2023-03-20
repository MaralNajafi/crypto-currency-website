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
                <th scope="row" class="text-center">${
                  cryptoCurrency.market_cap_rank
                }</th>
                <td class="text-center"><img src="${
                  cryptoCurrency.image
                }" class="crypto-img"></td>
                <td class="text-left" colspan="2">${cryptoCurrency.name}</td>
                <td class="text-center">${cryptoCurrency.symbol}</td>
                <td class="text-center">$${Number(
                  cryptoCurrency.current_price
                ).toLocaleString()}</td>
                <td class="text-center">${Number(cryptoCurrency.price_change_percentage_24h).toFixed(2)
                }%</td>
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
