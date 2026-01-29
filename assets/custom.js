
document.addEventListener('DOMContentLoaded', () => {

    /////general animation
    const animatedElements = document.querySelectorAll('.fade-up-on-scroll');  
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observerOptions = {
        root: null, 
        rootMargin: '0px', 
        threshold: 0.05
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });


    ///apply class in body
    const element = document.getElementById('targetElement');            
    const delayMs = 1000; 

    setTimeout(() => {
        if (element) {
            element.classList.add('is-loaded');
            console.log('Class is-loaded applied after 1.5 seconds.');
        }
    }, delayMs);



    // DISABLED: Default auto product selector - was forcing subscription option on longform product
    // and overriding URL-based selection. Selection is now controlled by longform-product.liquid
    // (syncAppstleFromUrl: first option when no ?variant=, else option from URL).
    // if(document.querySelector('.main-pro-sec') && document.querySelector('.main-pro-sec').classList.contains('template-product-longform')){
    //     var isALARendered;
    //     function ALAcheck() { isALARendered = setInterval(customALA, 200); }
    //     ALAcheck();
    //     function customALA() {
    //         var selector = document.querySelector('.appstle_sub_widget');
    //         if(selector) {
    //             clearInterval(isALARendered);
    //             const subs_widget = document.querySelector('.appstle_sub_widget');
    //             if(subs_widget){
    //                 const subs_plan_input = subs_widget.querySelector('.appstle_subscription_wrapper_option.appstle_include_dropdown input[type="radio"]');
    //                 if(subs_plan_input){ subs_plan_input.checked = true; }
    //             }
    //         }
    //     }
    // }
        

});