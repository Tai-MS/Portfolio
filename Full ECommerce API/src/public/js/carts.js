const socket = io();
console.log('cart', user);
socket.emit('getCartByIdResponse', user); 

socket.on('cartResponse', (response) => {
    updateTable(response);
});

function updateTable(response) {
    if (response && response.cartProducts && Array.isArray(response.cartProducts)) {
        const products = response.cartProducts;
        const total = response.total;

        const tableContainer = document.getElementById('products-container');
        tableContainer.innerHTML = ''; 
        const productsContainer = document.querySelector('#products-container');

        if (products.length === 0) {
            const row = document.createElement('div');
            row.innerHTML = `
                <h2>Empty cart</h2>
            `;
            tableContainer.appendChild(row); 
        } else {
            productsContainer.innerHTML = `
                <table>
                    <tr>
                        <th>Product: </th>
                        <th>Quantity: </th>
                    </tr>
                </table>
            `;
            products.forEach(product => {
                const row = document.createElement('tr');
                console.log(product);
                row.innerHTML = `
                    <td>${product.title}</td>
                    <td>${product.quantity}</td>
                `;
                productsContainer.querySelector('table').appendChild(row);
            });

            const totalContainer = document.getElementById('total-container');
            totalContainer.innerHTML = `<h2>Total: $${total.toFixed(2)}</h2>`;
        }
    } 
}
