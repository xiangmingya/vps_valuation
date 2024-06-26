//const exchangeRateApiKey = 'yuokey';
//const exchangeRateApiUrl = `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/CNY`;
const exchangeRateApiUrl = `https://api.exchangerate-api.com/v4/latest/CNY`;

let exchangeRates = {};


async function fetchExchangeRates() {
    try {
        const response = await fetch(exchangeRateApiUrl);
        const data = await response.json();
        //const cnyRates = data.conversion_rates;
         const cnyRates = data.rates;
        
        
        exchangeRates = {
            "USD": 1 / cnyRates["USD"],
            "EUR": 1 / cnyRates["EUR"],
            "GBP": 1 / cnyRates["GBP"],
            "CAD": 1 / cnyRates["CAD"],
            "JPY": 1 / cnyRates["JPY"],
            "KRW": 1 / cnyRates["KRW"],
            "HKD": 1 / cnyRates["HKD"],
            "TWD": 1 / cnyRates["TWD"]
        };
        updateExchangeRate();
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
    }
}

function updateExchangeRate() {
    const currency = document.getElementById('currency').value;
    const exchangeRate = exchangeRates[currency];
    document.getElementById('exchangeRate').value = exchangeRate ? exchangeRate.toFixed(4) : '';
}

function calculate() {
    const purchaseAmount = parseFloat(document.getElementById('purchaseAmount').value);
    const renewalAmount = parseFloat(document.getElementById('renewalAmount').value);
    const exchangeRate = parseFloat(document.getElementById('exchangeRate').value);
    const paymentPeriod = parseInt(document.getElementById('paymentPeriod').value);
    const purchaseDate = new Date(document.getElementById('purchaseDate').value);
    const expiryDate = new Date(document.getElementById('expiryDate').value);

    const currentDate = new Date();
    const remainingMonths = Math.max(0, (expiryDate.getFullYear() - currentDate.getFullYear()) * 12 + (expiryDate.getMonth() - currentDate.getMonth()));

    const remainingValue = (renewalAmount * exchangeRate / paymentPeriod) * remainingMonths;
    const overchargeAmount = purchaseAmount - remainingValue;

    document.getElementById('remainingValue').textContent = remainingValue.toFixed(2);
    document.getElementById('overchargeAmount').textContent = overchargeAmount.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchExchangeRates();
    updateExchangeRate();
});

//页面浏览次数
 window.onload = function() {
    fetch('/record-view', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('viewCount').textContent = data.views;
    })
    .catch(error => {
        console.error('Failed to record view:', error);
    });
}
