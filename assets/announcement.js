(function () {
	const announcementSlider = () => {
		$(".announcement-bar__slide").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			if ($(".announcement-bar")) {
				$(this).addClass("slider_started");
			}

			const announcementId = $(this).data("announcement-id");
			const announcementSwiper = new Swiper(
				`.announcement-js-${announcementId}`,
				{
					loop: false,
					navigation: {
						nextEl: `#shopify-section-${announcementId} .announcement-btn-next`,
						prevEl: `#shopify-section-${announcementId} .announcement-btn-prev`,
					},
				}
			);
		});
	};

	announcementSlider();
	document.addEventListener("shopify:section:load", function () {
		announcementSlider();
	});
})();
