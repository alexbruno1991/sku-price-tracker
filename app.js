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
