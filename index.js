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
  let number = 0;
  const cryptoCurrencies = cryptoCurrenciesArray
    .map((cryptoCurrency) => {
      number++;
      return `
            <tr>
                <th scope="row">${number}</th>
                <td>${cryptoCurrency.name}</td>
                <td>${cryptoCurrency.symbol}</td>
                <td>${cryptoCurrency.current_price}</td>
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
