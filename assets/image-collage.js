(function () {
	const imageCollageSections = document.querySelectorAll('.image-collage-section');
	imageCollageSections.forEach(section => {
		const images = section.querySelectorAll('.js-parallax');
		const arr = [-70, 70, 15, -30];
	
		images.forEach((image, i) => {
			image.setAttribute('data-parallax-property-value', arr[i]);
		});
	})
})();
