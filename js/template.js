/* Theme Name: Worthy - Free Powerful Theme by HtmlCoder
 * Author:HtmlCoder
 * Author URI:http://www.htmlcoder.me
 * Version:1.0.0
 * Created:November 2014
 * License: Creative Commons Attribution 3.0 License (https://creativecommons.org/licenses/by/3.0/)
 * File Description: Initializations of plugins
 */

document.addEventListener('DOMContentLoaded', () => {
    // Fixed header
    const handleScroll = () => {
        const header = document.querySelector('.header.fixed');
        if (header) {
            if (window.scrollY > 0 && window.innerWidth > 767) {
                document.body.classList.add('fixed-header-on');
            } else {
                document.body.classList.remove('fixed-header-on');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);

    // Initialize Backstretch (still using jQuery as required by the plugin)
    $('.page-index .banner-image').backstretch('images/banner.jpg');
    $('.page-audio .banner-image').backstretch('images/audio.jpg');

    // Smooth Scroll
    document.querySelectorAll('.smooth-scroll a[href*="#"]:not([href="#"]), a[href*="#"]:not([href="#"]).smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                const target = document.querySelector(this.hash) || document.querySelector(`[name=${this.hash.slice(1)}]`);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 151,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animations
    const animateElements = document.querySelectorAll('[data-animation-effect]');
    if (animateElements.length > 0 && !Modernizr.touch) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationEffect = element.getAttribute('data-animation-effect');
                    if (window.innerWidth >= 768 && Modernizr.csstransitions) {
                        setTimeout(() => {
                            element.classList.add('animated', 'object-visible', animationEffect);
                        }, 400);
                    } else {
                        element.classList.add('object-visible');
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -130px 0px'
        });

        animateElements.forEach(element => observer.observe(element));
    }

    // Isotope filters
    const isotope = document.querySelector('.isotope-container');
    if (isotope) {
        window.addEventListener('load', () => {
            isotope.style.opacity = '1';
            const iso = new Isotope(isotope, {
                itemSelector: '.isotope-item',
                layoutMode: 'masonry',
                transitionDuration: '0.6s',
                filter: "*"
            });

            document.querySelectorAll('.filters ul.nav li a').forEach(filter => {
                filter.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filterValue = this.getAttribute('data-filter');
                    document.querySelector('.filters li.active').classList.remove('active');
                    this.parentElement.classList.add('active');
                    iso.arrange({ filter: filterValue });
                });
            });
        });
    }

    // Scroll Spy
    const scrollSpy = document.querySelector('.scrollspy');
    if (scrollSpy) {
        document.body.classList.add('scroll-spy');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('.scrollspy li a').forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.scrollspy li').forEach(section => observer.observe(section));
    }
});
