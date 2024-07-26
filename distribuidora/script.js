// script.js

let products = [];
let cart = [];

// Função para cadastrar um novo produto
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const barcode = document.getElementById('productBarcode').value;

    const product = { name, price, barcode };
    products.push(product);

    alert('Produto cadastrado com sucesso!');
    this.reset();
});

// Função para iniciar o scanner
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#video'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (data) {
        const barcode = data.codeResult.code;
        const product = products.find(prod => prod.barcode === barcode);

        if (product) {
            cart.push(product);
            updateCart();
        } else {
            alert('Produto não encontrado!');
        }
    });
}

// Função para parar o scanner
function stopScanner() {
    Quagga.stop();
}

// Função para atualizar a lista do carrinho
function updateCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    let total = 0;
    cart.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - R$${product.price.toFixed(2)}`;
        cartList.appendChild(li);
        total += product.price;
    });

    document.getElementById('totalPrice').textContent = total.toFixed(2);
}
