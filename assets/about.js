(function () {
	const initProductAccordion = () => {
		// Wait for jQuery to be available
		if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
			setTimeout(initProductAccordion, 100);
			return;
		}

		$(".product-about__accordion-title").off('click').on('click', function () {
			const $title = $(this);
			const $content = $title.siblings(".product-about__accordion-content");
			
			if (!$title.hasClass("active")) {
				// Close all other accordions
				$(".product-about__accordion-title.active").removeClass("active");
				$(".product-about__accordion-content").stop().slideUp(300);
				
				// Open this accordion
				$title.addClass("active");
				$content.stop().slideDown(300);
			} else {
				// Close this accordion
				$title.removeClass("active");
				$content.stop().slideUp(300);
			}
		});
	};

	// Initialize when DOM is ready and jQuery is loaded
	const initializeWhenReady = () => {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', initProductAccordion);
		} else {
			// DOM is already ready, but jQuery might not be loaded yet
			if (typeof jQuery !== 'undefined' && typeof $ !== 'undefined') {
				initProductAccordion();
			} else {
				// Wait for jQuery to load
				setTimeout(initializeWhenReady, 100);
			}
		}
	};

	// Handle Shopify section loading
	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
	});

	// Initialize on page load
	initializeWhenReady();
})();
