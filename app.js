document.getElementById('addAsin').addEventListener('click', () => {
    const asin = document.getElementById('asin').value;
    const mapPrice = document.getElementById('mapPrice').value;
    
    if (asin && mapPrice) {
        const asinContainer = document.getElementById('asinContainer');
        const asinEntry = document.createElement('div');
        asinEntry.className = 'asin-entry';
        
        const asinInput = document.createElement('input');
        asinInput.type = 'text';
        asinInput.value = asin;
        asinInput.disabled = true;
        asinEntry.appendChild(asinInput);
        
        const mapPriceInput = document.createElement('input');
        mapPriceInput.type = 'number';
        mapPriceInput.value = mapPrice;
        mapPriceInput.disabled = true;
        asinEntry.appendChild(mapPriceInput);
        
        const removeButton = document.createElement('span');
        removeButton.className = 'remove-asin';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            asinContainer.removeChild(asinEntry);
        });
        asinEntry.appendChild(removeButton);
        
        asinContainer.appendChild(asinEntry);
        
        // Clear the inputs
        document.getElementById('asin').value = '';
        document.getElementById('mapPrice').value = '';
    } else {
        alert('Please enter a valid ASIN and MAP Price.');
    }
});

document.getElementById('refresh').addEventListener('click', async () => {
    const asinEntries = document.querySelectorAll('.asin-entry');
    const asins = [];
    
    asinEntries.forEach(entry => {
        const asin = entry.querySelector('input[type="text"]').value;
        const mapPrice = entry.querySelector('input[type="number"]').value;
        asins.push({ asin, mapPrice });
    });
    
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = ''; // Clear previous results
    
    for (const { asin, mapPrice } of asins) {
        const response = await fetch(`/scrape?asin=${asin}&mapPrice=${mapPrice}`);
        const data = await response.json();
        
        if (data) {
            const mainRow = document.createElement('tr');
            mainRow.innerHTML = `
                <td>${data.vendor}</td>
                <td>${data.price}</td>
                <td>${data.asin}</td>
                <td><a href="${data.url}" target="_blank">Product Link</a></td>
            `;
            tableBody.appendChild(mainRow);
            
            if (data.otherSellers && data.otherSellers.length > 0) {
                data.otherSellers.forEach(seller => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${seller.seller}</td>
                        <td>${seller.price}</td>
                        <td>${data.asin}</td>
                        <td><a href="${data.url}" target="_blank">Product Link</a></td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }
    }
});
