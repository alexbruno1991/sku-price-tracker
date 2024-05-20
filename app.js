document.getElementById('sku-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const sku = document.getElementById('sku').value;
    const mapPrice = parseFloat(document.getElementById('map-price').value).toFixed(2);
    
    const skuList = document.getElementById('sku-list');
    const skuItem = document.createElement('div');
    skuItem.className = 'sku-item';
    skuItem.innerHTML = `
        <p>SKU: ${sku}</p>
        <p>MAP Price: $${mapPrice}</p>
    `;
    
    skuList.appendChild(skuItem);
    
    document.getElementById('sku-form').reset();
});

document.getElementById('refresh-button').addEventListener('click', function() {
    const skuItems = document.querySelectorAll('.sku-item');
    const results = document.getElementById('results');
    results.innerHTML = '';
    skuItems.forEach(item => {
        const sku = item.querySelector('p:nth-child(1)').innerText.split(': ')[1];
        const mapPrice = parseFloat(item.querySelector('p:nth-child(2)').innerText.split(': ')[1].replace('$', ''));
        checkAmazonPrice(sku, mapPrice);
    });
});

function checkAmazonPrice(sku, mapPrice) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const amazonUrl = `https://www.amazon.com/dp/${sku}`;
    
    axios.get(proxyUrl + amazonUrl)
        .then(response => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');
            const priceElement = doc.querySelector('#priceblock_ourprice, #priceblock_dealprice');
            const price = priceElement ? parseFloat(priceElement.innerText.replace('$', '')) : null;

            if (price && price < mapPrice) {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <p>SKU: ${sku}</p>
                    <p>Current Price: $${price.toFixed(2)}</p>
                    <p>MAP Price: $${mapPrice}</p>
                    <a href="https://www.amazon.com/dp/${sku}" target="_blank">View on Amazon</a>
                `;
                document.getElementById('results').appendChild(resultItem);
            } else if (!price) {
                console.error(`Price not found for SKU: ${sku}`);
            }
        })
        .catch(error => {
            console.error('Error fetching data from Amazon:', error);
        });
}
