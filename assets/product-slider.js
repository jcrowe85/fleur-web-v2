(function () {
	const initSliders = () => {
		const productSliderSection = document.querySelectorAll('.product-slider-section');
		const productSliders = document.querySelectorAll('.product-slider__swiper-product');
		const imageSliders = document.querySelectorAll('.product-slider__swiper-image');
		const prevArrows = document.querySelectorAll('.product-slider__buttons .swiper-btn--prev');
		const nextArrows = document.querySelectorAll('.product-slider__buttons .swiper-btn--next');
		const pagination = document.querySelectorAll('.product-slider__pagination');

		productSliders.forEach((slider, index) => {
			const productSlider = new Swiper(slider, {
				slidesPerView: 1,
				loop: true,
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
				navigation: {
					nextEl: nextArrows[index],
					prevEl: prevArrows[index],
				},
				pagination: {
					el: pagination[index],
					clickable: true,
					type: 'bullets',
				},
			});
			

			const imageSlider = new Swiper(imageSliders[index], {
				slidesPerView: 1,
				loop: true,
				spaceBetween: -1,
				slidesOffsetAfter: 0,
        slidesOffsetBefore: 1
			});

			imageSlider.controller.control = productSlider;
			productSlider.controller.control = imageSlider;

			productSlider.on('slideChange', function() {
        productSlider.pagination.render();
        productSlider.pagination.update();
      });
		})	
	}

	const toggleButton = () => {
    const swiperPagination = document.querySelectorAll('.product-slider__pagination');
    if (swiperPagination) {
      swiperPagination.forEach(element => {
        if (element.querySelectorAll('.swiper-pagination-bullet').length <=1 ) {
          element.parentElement.parentElement.querySelector('.product-slider__buttons').classList.add('hide');
        }
        else {
          element.parentElement.parentElement.querySelector('.product-slider__buttons').classList.remove('hide');
        }
      });
    }
  }

	const scaleImage = () => {
		document.addEventListener('scroll', function () {
			const productSliderSection = document.querySelectorAll('.product-slider-section');
			const scroll = window.pageYOffset || document.documentElement.scrollTop;

			productSliderSection.forEach(section => {
				const elOffset = section.offsetTop;	

				section.querySelectorAll('.product-slider__image-wrapper').forEach(image => {
					image.style.transform = `scale3d(${(100 - (scroll - elOffset)/60)/100}, ${(100 - (scroll - elOffset)/60)/100}, ${(100 - (scroll - elOffset)/60)/100})`;
				})
			})
		});

	}

	const resizeproductSlider = () => {
		const productSliderSection = document.querySelectorAll('.product-slider-section');

		const sectionResizeObserver = new ResizeObserver((entries) => {

			const [entry] = entries;

			setTimeout(function(){
				initSliders();
				toggleButton();
				scaleImage();
			}, 100);
		});

		productSliderSection.forEach(section => {
			sectionResizeObserver.observe(section);
		});
	}

	resizeproductSlider();

	document.addEventListener('shopify:section:load', function () {
		resizeproductSlider();
	})

	document.addEventListener('shopify:section:reorder', function () {
		resizeproductSlider();
	})
})();