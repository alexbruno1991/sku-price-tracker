document.getElementById('refresh').addEventListener('click', async () => {
    const asin = document.getElementById('asin').value;
    const mapPrice = document.getElementById('mapPrice').value;
    
    if (asin && mapPrice) {
        const response = await fetch(`/scrape?asin=${asin}&mapPrice=${mapPrice}`);
        const data = await response.json();

        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = ''; // Clear previous results

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
    } else {
        alert('Please enter a valid ASIN and MAP Price.');
    }
});
