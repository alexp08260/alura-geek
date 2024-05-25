const http = require('http');
const fs = require('fs');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const dataFile = './data.json';

// Leer datos desde el archivo JSON
function readData() {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile);
        return JSON.parse(data);
    } else {
        return { products: [] };
    }
}

// Escribir datos al archivo JSON
function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (parsedUrl.pathname === '/products' && method === 'GET') {
        const data = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data.products));
    } else if (parsedUrl.pathname === '/products' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newProduct = JSON.parse(body);
            newProduct.id = uuidv4(); // Añadir un ID único a cada producto
            const data = readData();
            data.products.push(newProduct);
            writeData(data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newProduct));
        });
    } else if (parsedUrl.pathname.startsWith('/products/') && method === 'DELETE') {
        const productId = parsedUrl.pathname.split('/')[2];
        const data = readData();
        const updatedProducts = data.products.filter(product => product.id !== productId);

        if (updatedProducts.length !== data.products.length) {
            data.products = updatedProducts;
            writeData(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Producto con ID ${productId} eliminado` }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Producto no encontrado');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});