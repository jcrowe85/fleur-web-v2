(function () {
	const testimonials = () => {
		$(".testimonials-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".testimonials");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			if (autoplay) {
				autoplayParm = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParm = {};
			}
			let swiperParms = {
				effect: 'slide',
				speed: box.data("speed") * 1000,
				slidesPerView: 1,
				spaceBetween: 15,
				breakpoints: {
					576: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					990: {
						slidesPerView: 3,
						spaceBetween: 25,
					},
				},
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
				...autoplayParm,
			};
			const swiper = new Swiper(`#${id} .swiper`, swiperParms);
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		testimonials();
		document.addEventListener("shopify:section:load", function () {
			testimonials();
		});
	});
})();
