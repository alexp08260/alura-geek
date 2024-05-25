
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("product-form");
    const clearBtn = document.getElementById("clear-btn");
    const productList = document.getElementById("product-list");

    function fetchProducts() {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';
                products.forEach(product => {
                    const productItem = document.createElement("div");
                    productItem.classList.add("product-item");
                    productItem.innerHTML = `
                        <div>
                            <strong>Nombre:</strong> ${product.name}
                        </div>
                        <div>
                            <strong>Precio:</strong> ${product.price} USD
                        </div>
                        <div>
                            <strong>Imagen:</strong> <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div>
                            <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                        </div>
                    `;
                    productList.appendChild(productItem);
                });
            });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío del formulario
        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const image = document.getElementById("product-image").value;

        // Enviar datos al servidor
        fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, image })
        }).then(response => response.json())
          .then(() => {
              fetchProducts(); // Actualizar la lista de productos
              form.reset();
          });
    });

    clearBtn.addEventListener("click", function() {
        form.reset();
    });

    // Eliminar producto
    productList.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            const productId = event.target.getAttribute("data-id");
            fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE'
            }).then(response => response.json())
              .then(() => {
                  fetchProducts(); // Actualizar la lista de productos
              });
        }
    });

    // Cargar productos al inicio
    fetchProducts();
});