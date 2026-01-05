(function () {
	const splitScreenSlid = () => {
		$(".split-screen-slideshow__section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".split-screen-slideshow");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			const speed = box.data("speed") * 1000;
			console.log(stopAutoplay);
			if (autoplay) {
				autoplayParm = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
						waitForTransition: true,
					},
				};
			} else {
				autoplayParm = {};
			}
			let swiperParms = {
				parallax: box.data("parallax"),
				effect: box.data("effect"),
				speed: speed,
				loop: false,
				centeredSlides: false,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				creativeEffect: {
					prev: {
						shadow: false,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: false,
				},
				flipEffect: {
					slideShadows: false,
				},
				...autoplayParm,
			};
			const swiperImg = new Swiper(
				`#${id} .split-screen-slideshow__image-swiper`,
				{ ...swiperParms, autoplay: false, allowTouchMove: false }
			);
			const swiperText = new Swiper(
				`#${id} .split-screen-slideshow__text-swiper`,
				{
					pagination: {
						el: `#${id} .swiper-pagination`,
						clickable: "true",
						type: "bullets",
						renderBullet: function (activeIndex, className) {
							return (
								'<span class="' +
								className +
								'">' +
								"<em>" +
								activeIndex +
								"</em>" +
								"<i></i>" +
								"<b></b>" +
								"</span>"
							);
						},
					},
					...swiperParms,
				}
			);
			
			swiperText.on("slideChange", function () {
				box.css("--bullet-duration", `${delay + speed}ms`);
			});

			swiperImg.controller.control = swiperText;
			swiperText.controller.control = swiperImg;
			
			swiperText.on("beforeTransitionStart", function () {
				colorScheme(this);
			});
			swiperText.on("slideChange", function () {
				colorScheme(this);
			});
			function colorScheme(context) {
				const parent = box.find(".split-screen-slideshow-bottom");
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [parent[0]];
				const colorScheme = $(activeSlide).data("color-scheme");
				changeItems.forEach((item) => {
					const classes = item.classList;
					for (let className of classes) {
						if (/color-background-\d+$/.test(className)) {
							item.classList.remove(className);
						}
					}
					item.classList.add(colorScheme);
				});
			}
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		splitScreenSlid();
		document.addEventListener("shopify:section:load", function () {
			splitScreenSlid();
		});
	});
})();