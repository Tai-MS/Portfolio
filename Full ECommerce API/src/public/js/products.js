const socket = io();
const queryParams = {}; 
socket.emit('getProducts', queryParams);

socket.on('productsResponse', (response) => {
    if (response.result === 'success') {
        updateTable(response.payload); 
        if (response.payload.page) {
            const currentPage = response.payload.page;
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('page', currentPage);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({}, '', newUrl);
        }
    } else {
        console.error('Error:', response.result);
    }
});

function updateTable(products) {
    const tableContainer = document.getElementById('products-container');
    tableContainer.innerHTML = ''; 
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Thumbnail</th>
        </tr>
    `;
    let buttonId = 0;

    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
            <td><button id="button-${buttonId}" ${product.stock <= 0 ? 'disabled' : ''}>Add to cart</button></td>
        `;
        tableContainer.appendChild(row);
        buttonId++;
    });

/**
 * FORMA ANTERIOR DE GENERAR LA VIEW
 * products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = 
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
            <td><button id="button-${buttonId++}">Add to cart</button></td>
        ;
        tableContainer.appendChild(row);
    });
 */


    products.forEach((product, index) => {
        const button = document.getElementById(`button-${index}`);
        button.addEventListener('click', () => {
            console.log(token);
            const fields = {
                cId: token,
                pId: product._id
            }
            // const token = document.cookie.split('; ').find(row => row.startsWith('auth-token=')).split('=')[1];
            socket.emit('addProductsToCart',  fields);
        });
    });
}
