const CRYPTO_CURRENCY_API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"

async function fetchAPI(url) {
    const data = await fetch (url);
    const dataJson = await data.json();
    return dataJson;
};


let cryptoCurrenciesArray = [];

document.addEventListener('DOMContentLoaded', async () => {
    cryptoCurrenciesArray = await fetchAPI(CRYPTO_CURRENCY_API_URL).catch(console.log)
    console.log(cryptoCurrenciesArray);
})