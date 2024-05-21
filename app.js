document.getElementById('asin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const asin = document.getElementById('asin').value;
    const mapPrice = parseFloat(document.getElementById('map-price').value).toFixed(2);
    
    const asinList = document.getElementById('asin-list');
    const asinItem = document.createElement('div');
    asinItem.className = 'asin-item';
    asinItem.innerHTML = `
        <p>ASIN: ${asin}</p>
        <p>MAP Price: $${mapPrice}</p>
    `;
    
    asinList.appendChild(asinItem);
    
    document.getElementById('asin-form').reset();
});

document.getElementById('refresh-button').addEventListener('click', function() {
    const asinItems = document.querySelectorAll('.asin-item');
    const results = document.getElementById('results');
    results.innerHTML = '';
    asinItems.forEach(item => {
        const asin = item.querySelector('p:nth-child(1)').innerText.split(': ')[1];
        const mapPrice = parseFloat(item.querySelector('p:nth-child(2)').innerText.split(': ')[1].replace('$', ''));
        checkAmazonPrice(asin, mapPrice);
    });
});

function checkAmazonPrice(asin, mapPrice) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const amazonUrl = `https://www.amazon.com/dp/${asin}`;
    
    console.log(`Fetching price for ASIN: ${asin} with MAP Price: $${mapPrice}`);
    
    axios.get(proxyUrl + amazonUrl)
        .then(response => {
            console.log
