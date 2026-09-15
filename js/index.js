
//! __________________________________________ Global_Variables __________________________________________

let btnPrevCarousel = document.querySelector("#Special-Carousel button.prev"),
	btnNextCarousel = btnPrevCarousel.nextElementSibling,
	slideContainer = document.querySelector("#Special-Carousel .special-carousel-inner"),
	firstSlide = slideContainer.querySelector(".special-carousel-item"),
	logoIcon = document.querySelector("link[rel='icon']"),
	logoImg = document.querySelector("img.logo"),
	correctImgs = document.querySelectorAll(".title img.correct"),
	nav = document.querySelector("nav.navbar"),
	navHight = nav.clientHeight,
	navLinks = nav.querySelectorAll(".navbar-nav:first-child .nav-link"),
	sections = document.querySelectorAll("section,header"),
	loadingPage = document.querySelector(".loadingPage"),
	body = document.querySelector("body"),
	latestContent = document.querySelector("#Latest .content"),
	FeaturedContent = document.querySelector("#Featured .content .row"),
	cartProducts = [],
	mainColorName = 'first',
	inputPassword = document.querySelector(".popup[data-popup-name='login'] .box form .group:nth-of-type(2) input"),
	favoriteProducts = [],
	formSearch = nav.querySelector(".search"),
	inputSearch = formSearch.firstElementChild,
	btnSearch = inputSearch.nextElementSibling,
	favoritesCounter = 0,
	cartCounter = 0;


checkNavOnScroll();

//! __________________________________________ CartProducts_Local_Storage __________________________________________

if (localStorage.getItem("cartProducts")) {
	cartProducts = JSON.parse(localStorage.getItem("cartProducts"));
} else {
	updateCartProductsStorage();
}

cartCounter = cartProducts.length;
updateCounter('cart', cartCounter);

//! __________________________________________ favoriteProducts_Local_Storage __________________________________________

if (localStorage.getItem("favoriteProducts")) {
	favoriteProducts = JSON.parse(localStorage.getItem("favoriteProducts"));

} else {
	updateFavoriteProductsStorage();
}

favoritesCounter = favoriteProducts.length;
updateCounter('favorites', favoritesCounter);

//! __________________________________________ MainColorName_Local_Storage __________________________________________

if (localStorage.getItem("mainColor")) {
	mainColorName = localStorage.getItem("mainColor");

} else {
	updateColorNameStorage(mainColorName);
}

//! __________________________________________ Apply_Color_Theme __________________________________________

let currentSlide = document.querySelector(`.special-carousel-item[data-color-name="${mainColorName}"]`);
currentSlide.classList.add("active1");
applyColorTheme(mainColorName);

//! __________________________________________ Loading_Page __________________________________________

window.addEventListener("DOMContentLoaded", function () {
	loadingPage.classList.add("hide");
	setTimeout(function () {
		loadingPage.classList.add("d-none");
		body.removeAttribute("style");
		currentSlide.classList.add("active2");

	}, 1000);
});

//! __________________________________________ Form_Search  __________________________________________

formSearch.addEventListener('submit', function (e) {
	e.preventDefault();
	let inputSearchValue = inputSearch.value.trim(),
		existProducts = [],
		isExist = false;

	if (inputSearchValue != '') {

		for (let product of products) {

			// (includes) return true or false
			isExist = product.name.toLowerCase().includes(inputSearchValue.toLowerCase());

			if (isExist) {
				let productEle = document.querySelector(`#Latest .product[data-product-id='${product.id}'], #Featured .product[data-product-id='${product.id}']`);

				existProducts.push(productEle);

				productEle.firstElementChild.classList.replace("bg-light", "bg-success-subtle");
			}
		}

		if (existProducts.length != 0) {

			// Bring the product into the visible area and center it vertically in the viewport;
			// if it is already visible and centered, no scrolling is needed
			existProducts[0].scrollIntoView({ block: "center" });

			// Check (to remove highlight from first exist product) after scrollIntoView() scrolls to the product
			window.addEventListener('scroll', function () {
				console.log("scroll");
				checkProductOnScroll(existProducts);
			});

			// Check (to remove highlight from first exist product) in case the product is already in the correct position,
			// because scrollIntoView() will not trigger the scroll event if no scrolling is needed
			checkProductOnScroll(existProducts);

		} else {
			let messageSearch = document.querySelector(`.popup[data-popup-name="search"] .box p.message-search`);
			messageSearch.textContent = "Please try in different words";
			openPopup('search');
		}

	} else {
		let messageSearch = document.querySelector(".popup[data-popup-name='search'] .box p.message-search");
		messageSearch.textContent = "Please write something to search";
		openPopup('search');
	}

	formSearch.reset();
});

//! __________________________________________ Next_Carousel __________________________________________

btnNextCarousel.addEventListener("click", function () {
	let currentSlide = document.querySelector(".special-carousel-item.active1.active2"),
		nextSlide = currentSlide.nextElementSibling ?? slideContainer.firstElementChild,
		colorName = nextSlide.dataset.colorName;

	// change slide
	currentSlide.classList.remove("active1", "active2");
	nextSlide.classList.add("active1", "active2");

	applyColorTheme(colorName);
});

//! __________________________________________ Prev_Carousel __________________________________________

btnPrevCarousel.addEventListener("click", function () {
	let currentSlide = document.querySelector(".special-carousel-item.active1.active2"),
		prevSlide = currentSlide.previousElementSibling ?? slideContainer.lastElementChild,
		colorName = prevSlide.dataset.colorName;

	// change slide
	currentSlide.classList.remove("active1", "active2");
	prevSlide.classList.add("active1", "active2");

	applyColorTheme(colorName);
});

//! __________________________________________ Keyboard_ArrowRight & ArrowLeft __________________________________________

document.addEventListener("keyup", function (e) {
	if (e.key == "ArrowRight") {
		btnNextCarousel.click();

	} else if (e.key == "ArrowLeft") {
		btnPrevCarousel.click();

	} else if (e.key == "Escape" && document.querySelector(".popup.active")) {
		closePopup();
	}
});

//! __________________________________________ Scroll __________________________________________

window.addEventListener("scroll", function () {
	checkNavOnScroll();

	sections.forEach(function (section) {
		updateNavLink(section.id);
	});
});

navLinks.forEach(function (navLink) {
	navLink.addEventListener("click", function (e) {
		e.preventDefault();

		let currentId = navLink.getAttribute("href"),
			currentSection = document.querySelector(currentId),
			topOfSection = currentSection.offsetTop;

		window.scrollTo({
			top: topOfSection - navHight + 3,
			left: 0,
		});
	});
});

//! __________________________________________ Latest_Products __________________________________________

latest.forEach(function (product) {

	let isProductIntoCart = checkProductExists(cartProducts, product.id);

	latestContent.innerHTML += `
        <div class="product"
            data-product-id="${product.id}"
            data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}"
            data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}">
            
            <div class="row row-gap-md-5 row1 bg-light mainBorder rounded-2 mx-0">
                <div class="part1 col-lg-6">
                    <div class="item  h-100">

                        <div class="row row2 h-100">
                            <div class="box1 col-md-2">
                                <div class="item">
                                    <ul class="list-unstyled m-0 d-flex justify-content-center flex-md-column gap-2">
                                       ${prepareLatestImgsList(product.images, product.name)}
                                    </ul>
                                </div>
                            </div>
                            <div class="box2 col-md-10">
                                <div class="item text-center h-100 d-flex align-items-center">
                                    <div class="selectedImg">
                                        <img src="images/products/${product.images[0]}" class="img-fluid"alt="${product.name}">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="part2 col-lg-6">
                    <div class="item">
                        <h3 class="main-color">${product.name}</h3>

                        <p class="text-secondary">${product.description}</p>

                        <div class="price d-flex align-items-baseline column-gap-2">
                            <div class="label">
                                <h6 class="m-0">Price :</h6>
                            </div>
                            <div class="value">
                                ${preparePrice(product.price, product.discount)}
                            </div>
                        </div>

                        <div class="size d-flex align-items-center column-gap-2">
                            <div class="label">
                                <h6 class="m-0">Size :</h6>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex column-gap-2 m-0">
                                    ${prepareSize(product.sizes, isProductIntoCart)}
                                </ul>
                            </div>
                        </div>

                        ${isProductIntoCart
			? `<button class="btn main-button remove" onclick="removeFromCart(${product.id},this)">Remove From Cart</button>`
			: `<button class="btn main-button" onclick="addToCart(${product.id},this)">Add To Cart</button>`
		}
    
                    </div>
                </div>
            </div>
        </div>
    `;
});

//! __________________________________________ Featured_Products __________________________________________

features.forEach(function (product) {

	let isProductInFavorites = checkProductExists(favoriteProducts, product.id);

	FeaturedContent.innerHTML += `
        <div class="product col-sm-6 col-lg-4 col-xl-3" data-product-id="${product.id}">
            <div class="item bg-light text-center box-shadow ${(isProductInFavorites) ? 'favorite-item' : ''}"  ondblclick="${(isProductInFavorites) ? `removeFromFavorites(${product.id},this)` : `addToFavorites(${product.id},this)`} ">

			   <div class="favorite d-none">
			   		<img src="images/heart.png" class="img-fluid" alt="heart">
			   </div>

			   ${(isProductInFavorites)

			? ` <div class="notice-bar" style="left:0">
					<p class="mb-0">Saved to favorites <i class="fa-solid fa-heart"></i></p>
				</div>`

			: ` <div class="notice-bar" >
					<p class="mb-0">Double-tap to favorite</p>
				</div>`
		}
				
                <div class="offer text-center ${product.discount == 0 ? "d-none" : ""}">-${product.discount * 100}%</div>
                
				<div class="head">
                    <div class="selectedImg">
                        <img src="images/products/${product.images[0]}" class="img-fluid" alt="${product.name}">
                    </div>

                    <div class="search rounded-circle"  onclick="showProduct(${product.id})">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <ul class="list-unstyled d-flex column-gap-2 justify-content-center mb-0">
                        ${prepareFeaturedImgList(product.images)}
                    </ul>
                </div>
                <div class="caption">
                    <p class="mb-2">${product.name}</p>
                    ${preparePrice(product.price, product.discount)}
                </div>
				
            </div>
        </div>
    `;
});

//! __________________________________________ Handle_Input_Password __________________________________________


inputPassword.addEventListener('keyup', function () {

	if (this.value) {
		this.nextElementSibling.classList.remove('d-none');

	} else {
		this.nextElementSibling.classList.add('d-none');
	}
});

inputPassword.nextElementSibling.addEventListener('click', function () {
	if (inputPassword.type == 'password') {
		inputPassword.type = 'text';

		inputPassword.nextElementSibling.classList.replace("fa-eye-slash", "fa-eye");

	} else if (inputPassword.type == 'text') {
		inputPassword.type = 'password';

		inputPassword.nextElementSibling.classList.replace("fa-eye", "fa-eye-slash");

	}
});

//! __________________________________________ ??????????????????????????????  __________________________________________


// let popupBoxes = document.querySelectorAll(".popup .box");

// popupBoxes.forEach(function (popupBox) {

// 	popupBox.onclick = function (e) {
// 		e.stopPropagation();
// 	};

// });












