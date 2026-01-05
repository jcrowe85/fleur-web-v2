$(document).ready(function () {
	let collectionListHover = () => {
		$('.categories-list__title').mouseenter(function (event) {
			const categoriesListProducts = document.querySelectorAll('.categories-list__product');
			const dataIndex = this.getAttribute("data-index");
			categoriesListProducts.forEach(product => {
				if (product.dataset.index == dataIndex) {
					product.classList.add('active')
				}
				else {
					product.classList.remove("active");
				}
			});
		});
	};

	document.addEventListener('shopify:section:load', function () {
		collectionListHover();
	});

	collectionListHover();
});
