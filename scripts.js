let products = [];

document.getElementById('loadProductsBtn').addEventListener('click', () => {
    loadProducts();
});

document.getElementById('showProductListBtn').addEventListener('click', () => {
    displayProductList();
});

document.getElementById('searchProductBtn').addEventListener('click', () => {
    document.getElementById('searchContainer').style.display = 'block';
});

document.getElementById('filterOptionsBtn').addEventListener('click', () => {
    displayFilterOptions();
});

document.getElementById('searchInput').addEventListener('input', debounce(() => {
    searchProducts(document.getElementById('searchInput').value);
}, 300));

async function loadProducts() {
    const button = document.getElementById('loadProductsBtn');
    button.textContent = 'Đang tải sản phẩm…';

    try {
        const response = await fetch('https://svc-0-staging-usf.hotyon.com/search?apiKey=1fedccb4-262f-4e65-ae6d-d01e8024fe83');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const data1 = data.data
        products = data1.items;

        button.textContent = `Đã tải xong ${products.length} sản phẩm`;
        document.getElementById('showProductListBtn').style.display = 'inline-block';
        document.getElementById('searchProductBtn').style.display = 'inline-block';
        document.getElementById('filterOptionsBtn').style.display = 'inline-block';
    } catch (error) {
        console.error('Error loading products:', error);
        button.textContent = 'Lỗi khi tải sản phẩm';
    }
}

function displayProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        let discount = '';
        const variant = product.variants[0];
        const price = variant.price;
        const compareAtPrice = variant.compareAtPrice;
        if (compareAtPrice > price) {
            discount = ` (${Math.round((1 - price / compareAtPrice) * 100)}% off)`;
        }

        productDiv.innerHTML = `
            <h3>${product.title}</h3>
            <p>${getOptionsString(product.options)}</p>
            <p>Price: $${price}</p>
            <p>Discount: ${discount}</p>
           
        `;

        productList.appendChild(productDiv);
    });

    productList.style.display = 'block';
}

function getOptionsString(options) {
    if (!options || options.length === 0) {
        return 'No options available';
    }

    return options.map(option => `${option.name}:${option.values.join(', ')}`).join('|=====|');
}

function searchProducts(query) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = 'Đang tìm kiếm...';

    setTimeout(() => {
        const results = products.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));

        if (results.length > 0) {
            searchResults.innerHTML = '';
            results.forEach(product => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'product';

                let discount = '';
                const price = product.variants[0].price;
                const compareAtPrice = product.variants[0].compareAtPrice;
                if (compareAtPrice > price) {
                    discount = ` (${Math.round((1 - price / compareAtPrice) * 100)}% off)`;
                }

                resultDiv.innerHTML = `
                <h3>${product.title}</h3>
                <p>${getOptionsString(product.options)}</p>
                <p>Price: $${price}</p>
                <p>Discount: ${discount}</p>
                `;

                searchResults.appendChild(resultDiv);
            });
        } else {
            searchResults.innerHTML = 'Không có sản phẩm nào khớp với từ khoá cần tìm';
        }
    }, 1000);
}

function debounce(callback, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback();
        }, delay);
    }
}

function displayFilterOptions() {
    const filterContainer = document.getElementById('filterContainer');
    filterContainer.innerHTML = '';
    filterContainer.style.display = 'block';

    const options = new Set();
    products.forEach(product => {
        product.options.forEach(option => options.add(`${option.name}: ${option.value}`));
    });

    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => {
            filterProducts(option);
        });
        filterContainer.appendChild(optionButton);
    });
}

function filterProducts(option) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const results = products.filter(product => product.options.some(o => `${o.name}: ${o.value}` === option));

    results.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        let discount = '';
        const price = product.variants[0].price;
        const compareAtPrice = product.variants[0].compareAtPrice;
        if (compareAtPrice > price) {
            discount = ` (${Math.round((1 - price / compareAtPrice) * 100)}% off)`;
        }

        productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>${getOptionsString(product.options)}</p>
        <p>Price: $${price}</p>
        <p>Discount: ${discount}</p>
        `;

        productList.appendChild(productDiv);
    });

    productList.style.display = 'block';
}
