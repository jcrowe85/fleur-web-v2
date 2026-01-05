(function () {
	const setStepsParallaxOpt = (elem) => {
		elem.setAttribute('data-parallax-property-value', '-40');
		elem.setAttribute('data-parallax-steps', '0, 40');
		elem.setAttribute('data-parallax-property', 'translateY');
	}

	const removeStepsParallaxOpt = (elem) => {
		elem.removeAttribute('data-parallax-property-value');
		elem.removeAttribute('data-parallax-steps');
		elem.removeAttribute('data-parallax-property');
		elem.removeAttribute('style');
	}

	const calcDurationScroll = (elem) => {
		switch (elem.length) {
			case 1:
				return 'bottom bottom';
			case 2:
				return '+=80%';
			case 3:
				return '+=140%';
			case 4:
				return '+=180%';
			case 5:
				return '+=200%';
		}
	}

	const initStepsParallax = () => {
		const stepsSections = document.querySelectorAll('.steps-section');

		stepsSections.forEach(elem => {
			const parallax = elem.querySelectorAll('.steps__scroll-parallax');

			parallax.forEach(elem => {
				if (window.matchMedia('(min-width: 990px)').matches) {
					elem.classList.add('js-parallax');
					setStepsParallaxOpt(elem);
				} else {
					elem.classList.remove('js-parallax');
					removeStepsParallaxOpt(elem);
				}
			});
		});
	}

	const initStepsAnim = () => {
		const containers = document.querySelectorAll('.steps');

		containers.forEach(elem => {
			ScrollTrigger.matchMedia({
				"(min-width: 990px)": function() {
					const slides = elem.querySelectorAll('.steps__slide-item--desktop');
					let parallax = elem.querySelector('.steps__scroll');
					let progress = [];

					slides.forEach((elem, index) => {
						progress.push(1 / slides.length * (index) - 1 / slides.length / 2);
					});

					progress.push(1);

					const removeActiveClass = () => {
						slides.forEach((elem) => {
							elem.classList.remove('active');
						})
					}

					let st = ScrollTrigger.create({
						trigger: elem,
						start: 'top top',
						end: calcDurationScroll(slides),
						invalidateOnRefresh: true,
						animation: parallax ? gsap.fromTo(parallax, {y: 0}, {y: -(parallax.scrollHeight - elem.clientHeight + 310)}) : false,
						pin: true,
						scrub: 0.5,
						onRefresh: self => {
							for (let i = 0; i <= slides.length; i++) {
								if (self.progress > progress[i] && self.progress < progress[i+1]) {
									removeActiveClass();
									slides[0].classList.remove('active');
									slides[i].classList.add('active');
									slides[i].classList.remove('prev');
								}
							}
						},
						onUpdate: self => {
							for (let i = 0; i <= slides.length; i++) {
								if (self.progress > progress[i] && self.progress < progress[i+1]) {
									if (!slides[i].classList.contains('active')) {
										removeActiveClass();
										slides[i].classList.add('active');
										slides[i].classList.remove('prev');

										for (let el of slides) {
											if (el.classList.contains('active')) break;
											el.classList.add('prev');
										}
									}
								}
							}
						}
					});
				},
				"(max-width: 989px)": function() {
					if (elem.querySelector('.steps__scroll') !== null) {
						elem.querySelector('.steps__scroll').style.transform = 'translate3d(0, 0, 0)';
						ScrollTrigger.getAll().forEach(el => el.kill());
					}
				}
			});
		});
	};

	document.addEventListener('shopify:section:load', function () {
		setTimeout(() => {
			initStepsAnim();
			initStepsParallax();
		}, 300);
	});

	window.addEventListener('resize', function () {
		setTimeout(() => {
			initStepsAnim();
			initStepsParallax();
		}, 300);
	});

	setTimeout(() => {
		initStepsAnim();
		initStepsParallax();
	}, 300);
})();
