const ulProductsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();
    const productsList = data.payload;

    ulProductsList.innerText = "";

    productsList.forEach((products) => {
        const li = document.createElement("li");
        li.innerHTML = `<i>Id:</i> ${products.id} - <i>Nombre:</i> ${products.name}`;
        ulProductsList.append(li);
    });
};

const createProduct = async (data) => {
    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    await loadProductsList();
};

const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProductsList();
};

btnRefreshProductsList.onclick = () => {
    loadProductsList();
};

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    form.reset();

    createProduct({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        code: formData.get("code"),
        stock: formData.get("stock"),
        category: formData.get("category"),
    });
};

btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value);
    inputProductId.value = "";

    if (id > 0) {
        deleteProduct(id);
    }
};

loadProductsList();