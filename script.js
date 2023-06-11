function rememberMe() {
	var isChecked = document.getElementById("remember").checked;
	setCookie("remember", isChecked, 7);
	if (isChecked) {
		var userId = generateId();
		setCookie("userId", userId, 7);
	}
}

function addToCart(name, price) {
	var cart = getCart();
	var found = false;
	for (var i = 0; i < cart.length; i++) {
		if (cart[i].name === name) {
			cart[i].quantity++;
			found = true;
			break;
		}
	}
	if (!found) {
		cart.push({
			name: name,
			price: price,
			quantity: 1
		});
	}
	setCart(cart);
	alert("Item added to cart.");
}

function getCart() {
	var cart = JSON.parse(localStorage.getItem("Continued from the previous page:cart")) || [];
	if (getCookie("remember") === "true") {
		var storedCart = getCookie("cart");
		if (storedCart) {
			cart = JSON.parse(decodeURIComponent(storedCart));
		}
	}
	return cart;
}

function setCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
	if (getCookie("remember") === "true") {
		var encodedCart = encodeURIComponent(JSON.stringify(cart));
		setCookie("cart", encodedCart, 7);
	}
}

function clearCart() {
	localStorage.removeItem("cart");
	deleteCookie("cart");
	location.reload();
}

function generateId() {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var id = "";
	for (var i = 0; i < 10; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

function getCookie(name) {
	var cookieArr = document.cookie.split("; ");
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split("=");
		if (name === cookiePair[0]) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function deleteCookie(name) {
	setCookie(name, "", -1);
}

function updateCart() {
	var cart = getCart();
	var cartTable = document.getElementById("cart");
	cartTable.innerHTML = "";
	var subtotal = 0;
	for (var i = 0; i < cart.length; i++) {
		var item = cart[i];
		var total = item.price * item.quantity;
		subtotal += total;
		var row = document.createElement("tr");
		var nameCell = document.createElement("td");
		nameCell.textContent = item.name;
		row.appendChild(nameCell);
		var priceCell = document.createElement("td");
		priceCell.textContent = "$" + item.price.toFixed(2);
		row.appendChild(priceCell);
		var quantityCell = document.createElement("td");
		var quantityInput = document.createElement("input");
		quantityInput.type = "number";
		quantityInput.min = "1";
		quantityInput.value = item.quantity;
		quantityInput.onchange = (function(item) {
			return function() {
				item.quantity = parseInt(this.value);
				setCart(cart);
				updateCart();
			};
		})(item);
		quantityCell.appendChild(quantityInput);
		row.appendChild(quantityCell);
		var totalCell = document.createElement("td");
		totalCell.textContent = "$" + total.toFixed(2);
		row.appendChild(totalCell);
		var removeCell = document.createElement("td");
		var removeButton = document.createElement("button");
		removeButton.textContent = "Remove";
		removeButton.onclick = (function(item) {
			return function() {
				var index = cart.indexOf(item);
				if (index !== -1) {
					cart.splice(index, 1);
				}
				setCart(cart);
				updateCart();
			};
		})(item);
		removeCell.appendChild(removeButton);
		row.appendChild(removeCell);
		cartTable.appendChild(row);
	}
	var tax = subtotal * 0.08;
	var total = subtotal + tax;
	document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
	document.getElementById("tax").textContent = "$" + tax.toFixed(2);
	document.getElementById("total").textContent = "$" + total.toFixed(2);
}