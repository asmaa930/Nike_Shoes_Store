//! _____________________________________________
function updateCartProductsStorage() {
	localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

//! _____________________________________________
function updateFavoriteProductsStorage() {
	localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
}

//! _____________________________________________
function updateColorNameStorage(colorName) {
	localStorage.setItem("mainColor", colorName);
}

//! _____________________________________________
function updateCounter(type, counter) {

	let counterContainer;

	if (type == 'cart') {
		counterContainer = nav.querySelector("#Cart");

	} else if (type == 'favorites') {
		counterContainer = nav.querySelector("#Favorites");
	}
	// -----------------
	if (counter <= 0) {
		counterContainer.lastElementChild.classList.add("d-none");

	} else {
		counterContainer.lastElementChild.classList.remove("d-none");
		counterContainer.lastElementChild.textContent = `${counter}`;
	}
}

//! _____________________________________________
function changeMainColor(colorName) {
	let rootEle = document.querySelector("html"),

		mainColor = getComputedStyle(rootEle).getPropertyValue(`--${colorName}-color`),
		mainColorLight = getComputedStyle(rootEle).getPropertyValue(`--${colorName}-color-light`),
		mainColorDark = getComputedStyle(rootEle).getPropertyValue(`--${colorName}-color-dark`);

	rootEle.style.setProperty("--main-color", mainColor);
	rootEle.style.setProperty("--main-color-alpha", mainColor + "15");
	rootEle.style.setProperty("--main-color-light", mainColorLight);
	rootEle.style.setProperty("--main-color-dark", mainColorDark);

	updateColorNameStorage(colorName);
}

//! _____________________________________________
function changeImg(imgName, imgEle, commonName) {
	if (imgEle.matches("link[rel='icon']")) {
		let iconHref = imgEle.href,
			iconHrefArr = iconHref.split("/");

		iconHrefArr[iconHrefArr.length - 1] = `${imgName}-${commonName}.png`;
		imgEle.href = iconHrefArr.join("/");
	} else {
		let currentSrc = imgEle.src,
			currentSrcArr = currentSrc.split("/");

		currentSrcArr[currentSrcArr.length - 1] = `${imgName}-${commonName}.png`;
		imgEle.src = currentSrcArr.join("/");
	}
}

//! _____________________________________________
function applyColorTheme(colorName) {
	// change main color
	changeMainColor(colorName);

	// change imgs according to main color
	changeImg(colorName, logoIcon, "logo");
	changeImg(colorName, logoImg, "logo");
	correctImgs.forEach(function (img) {
		changeImg(colorName, img, "correct");
	});
}

//! _____________________________________________
function checkNavOnScroll() {
	if (window.scrollY > 10) {
		nav.classList.add("scrolled");
	} else {
		nav.classList.remove("scrolled");
	}
}

//! _____________________________________________
function checkProductOnScroll(existProducts) {

	let scrollYToCenterProduct = (existProducts[0].offsetTop) - (window.innerHeight / 2) + (existProducts[0].clientHeight / 2),
		maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

	// When the scroll reaches the position that centers the product || when product in the bottom of the page
	if (Math.abs(window.scrollY - scrollYToCenterProduct) < 3 || Math.abs(window.scrollY - maxScrollY) < 3) {

		setTimeout(function () {

			existProducts.forEach(function (productEle) {
				productEle.firstElementChild.classList.replace("bg-success-subtle", "bg-light");
			});

		}, 800);
	}
}

//! _____________________________________________
function updateNavLink(sectionId) {
	let section = document.querySelector(`#${sectionId}`),
		sectionTop = section.offsetTop,
		sectionHeight = section.clientHeight,
		sectionBottom = sectionTop + sectionHeight;

	if (window.scrollY > sectionTop - navHight && window.scrollY < sectionBottom) {

		let navLinkOfSection = document.querySelector(`a[href="#${sectionId}"]`),
			navLinkActivated = nav.querySelector(".nav-link.active");

		navLinkActivated.classList.remove("active");
		navLinkOfSection.classList.add("active");
	}
}

//! _____________________________________________
function prepareLatestImgsList(images, productName, isProduct = false) {
	let liElements = ``;

	images.forEach(function (img) {
		liElements += `<li class=" ${isProduct ? "" : "mainBorder rounded-2"} "> <img src="images/products/${img}" class="img-fluid"
                        alt="${productName}" onclick="changeSelectedImg('${img}',this)"></li>`;
	});

	return liElements;
}

//! _____________________________________________
function prepareFeaturedImgList(images) {
	let liElements = ``;

	images.forEach(function (img, index) {
		liElements += `<li class="mainBorder rounded-circle ${index == 0 ? "active" : ""}" 
                        onclick="changeSelectedImg('${img}',this); changeActive(this)"></li>`;
	});

	return liElements;
}

//! _____________________________________________
function preparePrice(price, discount) {
	return `
        <p class="m-0">
            <span class="text-decoration-line-through main-color ${discount == 0 ? "d-none" : ""}">${price} <sup>$</sup></span>
            <span>${(price * (1 - discount)).toFixed(2)} <sup>$</sup></span>
        </p>
    `;
}

//! _____________________________________________
function prepareSize(sizes, isProductIntoCart = null, isProductIntoFavorites = null) {
	let liElements = ``;

	sizes.forEach(function (size, index) {
		if (isProductIntoCart) {
			liElements += `<li class="mainBorder rounded-2 ${isProductIntoCart.size == size ? 'active' : ''}" 
                        onclick = "changeActive(this); updateSize('${size}', this)">${size}</li>`;

		} else if (isProductIntoFavorites) {
			liElements += `<li class="main-button rounded-2">${size}</li>`;

		} else {
			liElements += `<li class="mainBorder rounded-2 ${index == 0 ? 'active' : ''}" 
                        onclick = "changeActive(this); updateSize('${size}', this)">${size}</li>`;
		}
	});

	return liElements;
}

//! _____________________________________________
function prepareColor(colors, isProductIntoCart = null, isProductIntoFavorites = null) {
	let liElements = ``;

	colors.forEach(function (color, index) {

		if (isProductIntoCart) {
			liElements += `<li class="rounded-circle ${isProductIntoCart.color == color ? 'active' : ''} " style="background-color: ${color};" 
                        onclick = "changeActive(this); updateColor('${color}',this)"></li>`;

		} else if (isProductIntoFavorites) {
			liElements += `<li class="rounded-circle" style="background-color: ${color};"></li>`;

		} else {
			liElements += `<li class="rounded-circle ${index == 0 ? 'active' : ''} " style="background-color: ${color};" 
                        onclick = "changeActive(this); updateColor('${color}',this)"></li>`;
		}
	});

	return liElements;
}
//! _____________________________________________
function changeSelectedImg(imgName, that) {

	let selectedImg = that.closest(".product").querySelector(".selectedImg img"),
		selectedImgSrc = selectedImg.src,
		selectedImgSrcArr = selectedImgSrc.split("/");

	selectedImgSrcArr[selectedImgSrcArr.length - 1] = imgName;
	selectedImg.src = selectedImgSrcArr.join("/");
}

//! _____________________________________________
function changeActive(that) {
	let activatedEle = that.parentElement.querySelector("li.active");

	activatedEle.classList.remove("active");
	that.classList.add("active");
}

//! _____________________________________________
function openPopup(popupName) {

	popup = document.querySelector(`[data-popup-name="${popupName}"]`);

	popupBox = popup.querySelector(".box");
	popupBox.onclick = function (e) {
		e.stopPropagation();
	};

	// The reason of (scrollTo the display:none element)  not work,
	// is that the element does not take any space between rendered elements - 
	// there's no X or Y position on the window that this element actually exist, 
	// so there's no value to scrollTo!
	//* popup.firstElementChild.scrollTo(0, 0);   // not work

	if (popup.classList.contains("show")) {
		popup.classList.remove("show");
	}

	// Reset the form and password visibility to the default state when reopening the login popup
	if (popupName == 'login') {

		let form = popup.querySelector("form");

		form.reset();
		inputPassword.type = 'password';
		inputPassword.nextElementSibling.classList.replace("fa-eye", "fa-eye-slash");
		inputPassword.nextElementSibling.classList.add("d-none");
	}

	popup.classList.add("active");

	// If the popup was scrolled to the bottom, close it, then open it again,
	// it will keep the previous scroll position, so reset it to the top
	popup.firstElementChild.scrollTo(0, 0);

	setTimeout(function () {
		popup.classList.add("show");
	}, 100);
}

//! _____________________________________________
function closePopup() {
	popup = document.querySelector(".popup.active");

	popup.classList.remove("show");
	setTimeout(function () {
		popup.classList.remove("active");
	}, 500);
}

//! _____________________________________________
function getProduct(productId) {
	return products.filter((product) => product.id == productId)[0];
}

//! _____________________________________________
function showProduct(productId) {
	let product = getProduct(productId),
		popupProductBox = document.querySelector(".popup[data-popup-name='product'] .box"),
		isProductIntoCart = checkProductExists(cartProducts, product.id);

	popupProductBox.innerHTML = `
        <div class="close main-color fs-4" onclick="closePopup()">
            <i class="fa-regular fa-circle-xmark"></i>
        </div>

        <div class="row product align-items-center"
            data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}"
            data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}">

            <div class="part1 col-md-6">
                <div class="item">
                    <div class="selectedImg">
                        <img src="images/products/${product.images[0]}" class="img-fluid" alt="${product.name}">
                    </div>

                    <ul class="list-unstyled m-0 d-flex justify-content-center gap-2">
                        ${prepareLatestImgsList(product.images, product.name, true)}
                    </ul>
                </div>
            </div>
            <div class="part2 col-md-6">
                <div class="item">
                    <h4>${product.name}</h4>
                    ${preparePrice(product.price, product.discount)}
                    <hr>
                    <p>${product.description}</p>

                    <div class="size d-flex align-items-center column-gap-2">
                        <div class="label">
                            <h6 class="mb-0">Size :</h6>
                        </div>
                        <div class="value">
                            <ul class="list-unstyled d-flex column-gap-2 m-0">
                                ${prepareSize(product.sizes, isProductIntoCart)}
                            </ul>
                        </div>
                    </div>

                    <div class="color d-flex align-items-center column-gap-2">
                        <div class="label">
                            <h6 class="mb-0">Color :</h6>
                        </div>
                        <div class="value">
                            <ul class="list-unstyled d-flex column-gap-2 m-0">
                                ${prepareColor(product.colors, isProductIntoCart)}
                            </ul>
                        </div>
                    </div>

                    ${isProductIntoCart
			? `<button class="btn main-button remove" onclick="removeFromCart(${product.id}, this)">Remove From Cart</button>`
			: `<button class="btn main-button" onclick="addToCart(${product.id}, this)">Add To Cart</button>`
		}

                </div>
            </div>
        </div>
    `;

	openPopup("product");
}



//! _____________________________________________
function addToCart(productId, that) {

	let selectedProduct = that.closest(".product"),
		newOrder = {
			id: productId,
			size: selectedProduct.dataset.selectedSize,
			color: selectedProduct.dataset.selectedColor,
		};

	cartProducts.push(newOrder);
	updateCartProductsStorage();

	let buttonOfLatestProduct = document.querySelector(`#Latest .product[data-product-id = "${productId}"] button`);
	if (buttonOfLatestProduct != that && buttonOfLatestProduct) {
		toggleOrderBtn("remove", buttonOfLatestProduct);
		buttonOfLatestProduct.setAttribute("onclick", `removeFromCart(${productId},this)`);
	}

	toggleOrderBtn("remove", that);
	that.setAttribute("onclick", `removeFromCart(${productId},this)`);

	updateCounter('cart', ++cartCounter);
}


//! _____________________________________________
function removeItem(items, itemId) {
	return items.filter((item) => item.id != itemId);
}

//! _____________________________________________
function removeFromCart(productId, that) {

	cartProducts = removeItem(cartProducts, productId);
	updateCartProductsStorage();

	let buttonOfLatestProduct = document.querySelector(`#Latest .product[data-product-id = "${productId}"] button.remove`);
	if (buttonOfLatestProduct != that && buttonOfLatestProduct) {
		toggleOrderBtn("add", buttonOfLatestProduct);
		buttonOfLatestProduct.setAttribute("onclick", `addToCart(${productId},this)`);
	}

	if (that) {
		toggleOrderBtn("add", that);
		that.setAttribute("onclick", `addToCart(${productId},this)`);
	}

	updateCounter('cart', --cartCounter);
}

//! _____________________________________________
function toggleOrderBtn(status, btn) {
	if (status == "add") {
		btn.classList.remove("remove");
		btn.textContent = "Add To Cart";

	} else if (status == "remove") {
		btn.classList.add("remove");
		btn.textContent = "Remove From Cart";
	}
}

//! _____________________________________________
function removeProductFromShop(cartProductId) {

	let cartProduct = document.querySelector(`.popup[data-popup-name='shop'] .box .row .product[data-product-id = "${cartProductId}"]`);

	cartProduct.remove();

	let buttonOfLatestProduct = document.querySelector(`#Latest .product[data-product-id = "${cartProductId}"] button.remove`);

	// to remove product from cart & reset button in Latest section
	removeFromCart(cartProductId, buttonOfLatestProduct);

	if (cartProducts.length == 0) {
		let cartProductsContainer = document.querySelector(".popup[data-popup-name='shop'] .box .row");
		cartProductsContainer.previousElementSibling.innerHTML = `<p class="alert alert-warning text-center mb-0">There are no products</p>`;
		cartProductsContainer.nextElementSibling.classList.add("d-none");
	}
}

//! _____________________________________________
function updateSize(size, that) {
	let product = that.closest(".product");
	product.dataset.selectedSize = size;
}

//! _____________________________________________
function updateColor(color, that) {
	let product = that.closest(".product");
	product.dataset.selectedColor = color;
}

//! _____________________________________________
function showCartProducts() {
	let cartProductsContainer = document.querySelector(".popup[data-popup-name='shop'] .box .row");
	cartProductsContainer.innerHTML = ``;

	if (cartProducts.length == 0) {
		cartProductsContainer.previousElementSibling.innerHTML = `<p class="alert alert-warning text-center mb-0">There are no products</p>`;
		cartProductsContainer.nextElementSibling.classList.add("d-none");

	} else {

		cartProductsContainer.previousElementSibling.innerHTML = ``;
		cartProductsContainer.nextElementSibling.classList.remove("d-none");

		cartProducts.forEach(function (cartProduct) {

			let selectedProduct = getProduct(cartProduct.id);

			cartProductsContainer.innerHTML += `
				<div class="product col-sm-6 col-md-4" data-product-id="${cartProduct.id}">
					<div class="item h-100 bg-light p-3 rounded-3 box-shadow">
						<div class="selectedImg">
							<img src="images/products/${selectedProduct.images[0]}" class="img-fluid" alt="${selectedProduct.name}">
						</div>
						<div class="caption">
							<div class="product-name">
								 <h5 class="m-0">${selectedProduct.name}</h5> 
								<!--<h4 class="m-0">${selectedProduct.name.slice(0, 13)}...</h4>-->
							</div>
							
							<div class="price d-flex align-items-baseline column-gap-2">
								<div class="label">
									<h6 class="m-0">Price :</h6>
								</div>
								<div class="value">
									${preparePrice(selectedProduct.price, selectedProduct.discount)}
								</div>
							</div>
	
							<div class="size d-flex align-items-center column-gap-2">
								<div class="label">
									<h6 class="m-0">Size :</h6>
								</div>
								<div class="value">
									<ul class="list-unstyled d-flex column-gap-2 m-0">
										${prepareSize([cartProduct.size])}
									</ul>
								</div>
							</div>
	
							<div class="color d-flex align-items-center column-gap-2">
								<div class="label">
									<h6 class="mb-0">Color :</h6>
								</div>
								<div class="value">
									<ul class="list-unstyled d-flex column-gap-2 m-0">
										${prepareColor([cartProduct.color])}
									</ul>
								</div>
							</div>
	
							<button class="btn w-100 mt-2" onclick="removeProductFromShop(${cartProduct.id})">Remove</button>
						</div>
					</div>
				</div>
			`;
		});
	}

	openPopup("shop");
}

//! _____________________________________________

function checkProductExists(products, productId) {
	let result = products.filter(product => product.id == productId);

	return result.length == 1 ? result[0] : null;
}

//! _____________________________________________

function favoriteAnimate(productFeaturedItem) {
	let favoriteImg = productFeaturedItem.querySelector(".favorite img"),

		keyframes = [
			{ transform: "scale(1)", opacity: 1 },
			{ transform: "scale(2)", opacity: 0.8 },
			{ transform: "scale(3)", opacity: 0.5 },
		],

		options = {
			duration: 600,
			iterations: 1,
			easing: 'linear',
		};

	favoriteImg.parentElement.classList.remove('d-none');
	favoriteImg.animate(keyframes, options);

	setTimeout(function () {
		favoriteImg.parentElement.classList.add('d-none');
	}, 500);
}

//! _____________________________________________

function favIconAnimate(favIcon) {
	let keyframes = [
		{ transform: "scale(1)" },
		{ transform: "scale(2)" },
		{ transform: "scale(0.8)" },
		{ transform: "scale(1.5)" },
		{ transform: "scale(1)" }
	],

		options = {
			duration: 800,
			iterations: 1,
			easing: "linear"
		};

	favIcon.animate(keyframes, options);
}

//! _____________________________________________

function addToFavorites(productId, that) {
	let sectionFeatured = that.closest('#Featured'),
		sectionLatest = that.closest('#Latest');

	if (sectionFeatured) {
		let productFeaturedItem = that,
			noticeMessage = productFeaturedItem.querySelector(".notice-bar p");

		favoriteAnimate(productFeaturedItem);
		productFeaturedItem.classList.add("favorite-item");
		noticeMessage.innerHTML = 'Saved to favorites <i class="fa-solid fa-heart"></i>';

		noticeMessage.parentElement.setAttribute('style', 'left:0');
		productFeaturedItem.setAttribute("ondblclick", `removeFromFavorites(${productId},this)`);

	} else if (sectionLatest) {
		let favIcon = that;
		favIcon.setAttribute('onclick', `removeFromFavorites(${productId},this)`);
		favIcon.classList.replace('fa-regular', 'fa-solid');
		favIconAnimate(favIcon);
	}
	//* -------------------------

	let product = getProduct(productId);
	favoriteProducts.push(product);
	updateFavoriteProductsStorage();

	updateCounter('favorites', ++favoritesCounter);
}

//! _____________________________________________

function removeFromFavorites(productId, that) {
	let sectionFeatured = that.closest('#Featured'),
		sectionLatest = that.closest('#Latest');

	if (sectionFeatured) {
		let productFeaturedItem = that,
			noticeMessage = productFeaturedItem.querySelector(".notice-bar p");

		productFeaturedItem.classList.remove("favorite-item");
		noticeMessage.innerHTML = 'Double-tap to favorite';
		noticeMessage.parentElement.removeAttribute('style');

		productFeaturedItem.setAttribute("ondblclick", `addToFavorites(${productId},this)`);

	} else if (sectionLatest) {
		let favIcon = that;
		favIcon.setAttribute("onclick", `addToFavorites(${productId},this)`);
		favIcon.classList.replace('fa-solid', 'fa-regular');
		favIcon.classList.remove('animate');
	}

	//* -------------------------

	favoriteProducts = removeItem(favoriteProducts, productId);
	updateFavoriteProductsStorage();

	updateCounter('favorites', --favoritesCounter);
}


//! _____________________________________________
function showFavoritesProducts() {
	let favoriteProductsContainer = document.querySelector(".popup[data-popup-name='favorites'] .box .row");
	favoriteProductsContainer.innerHTML = ``;

	if (favoriteProducts.length == 0) {
		favoriteProductsContainer.previousElementSibling.innerHTML = `<p class="alert alert-warning text-center mb-0">There are no favorites</p>`;

	} else {

		favoriteProductsContainer.previousElementSibling.innerHTML = ``;

		favoriteProducts.forEach(function (favoriteProduct) {

			favoriteProductsContainer.innerHTML += `
				<div class="product col-sm-6 col-md-4" data-product-id="${favoriteProduct.id}">
					<div class="item h-100 bg-light p-3 rounded-3 box-shadow" ondblclick="viewProductFromFavorites(${favoriteProduct.id})">
						<div class="notice">
							<p class="mb-0">Double-tap to view</p>
						</div>
						<div class="selectedImg">
							<img src="images/products/${favoriteProduct.images[0]}" class="img-fluid" alt="${favoriteProduct.name}">
						</div>
						<div class="caption">
							<div class="product-name">
								 <h5 class="m-0">${favoriteProduct.name}</h5> 
							</div>
							
							<div class="price d-flex align-items-baseline column-gap-2">
								<div class="label">
									<h6 class="m-0">Price :</h6>
								</div>
								<div class="value">
									${preparePrice(favoriteProduct.price, favoriteProduct.discount)}
								</div>
							</div>
	
							<div class="size d-flex align-items-center column-gap-2">
								<div class="label">
									<h6 class="m-0">Size :</h6>
								</div>
								<div class="value">
									<ul class="list-unstyled d-flex column-gap-2 m-0">
										${prepareSize(favoriteProduct.sizes, undefined, favoriteProduct)}
									</ul>
								</div>
							</div>
	
							<div class="color d-flex align-items-center column-gap-2">
								<div class="label">
									<h6 class="mb-0">Color :</h6>
								</div>
								<div class="value">
									<ul class="list-unstyled d-flex column-gap-2 m-0">
										${prepareColor(favoriteProduct.colors, undefined, favoriteProduct)}
									</ul>
								</div>
							</div>
	
							<button class="btn w-100" onclick="removeProductFromFavorites(${favoriteProduct.id},this)">Remove</button>
						</div>
					</div>
				</div>
			`;
		});
	}

	openPopup("favorites");
}

//! _____________________________________________
function removeProductFromFavorites(productId, btnRemoveFavorite) {

	let product = document.querySelector(`.product[data-product-id = "${productId}"]`),
		sectionFeatured = product.closest('#Featured'),
		sectionLatest = product.closest('#Latest');

	if (sectionFeatured) {
		let productItem = product.firstElementChild;
		removeFromFavorites(productId, productItem);

	} else if (sectionLatest) {
		let favIcon = product.querySelector('.part2 .item .fav-icon i');
		removeFromFavorites(productId, favIcon);
	}

	btnRemoveFavorite.closest(".product").remove();

	if (favoriteProducts.length == 0) {
		favoriteAlertEmpty = document.querySelector(".popup[data-popup-name='favorites'] .box .alert-empty");
		favoriteAlertEmpty.innerHTML = `<p class="alert alert-warning text-center mb-0">There are no favorites</p>`;
	}
}

//! _____________________________________________
function viewProductFromFavorites(productId) {
	closePopup();

	let popupProduct = document.querySelector(".popup[data-popup-name='product']");

	setTimeout(function () {
		showProduct(productId);

		popupProduct.setAttribute("onclick", "returnToFavorites()");
		popupProduct.querySelector(".close").setAttribute("onclick", "returnToFavorites()");

	}, 500);
}

//! _____________________________________________
function returnToFavorites() {
	closePopup();

	let popupProduct = document.querySelector(".popup[data-popup-name='product']");

	popupProduct.setAttribute("onclick", "closePopup()");
	popupProduct.querySelector(".close").setAttribute("onclick", "closePopup()");

	setTimeout(function () {
		openPopup("favorites");
	}, 500);
}

//! _____________________________________________
function focusOnSearch() {
	let inputSearch = nav.querySelector("form.search input");
	inputSearch.focus();
}


