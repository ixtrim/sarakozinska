(function(html) {

  "use strict";

  html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

  const ssAOS = function() {
      
    AOS.init( {
        offset: 100,
        duration: 600,
        easing: 'ease-in-out',
        delay: 300,
        once: true,
        disable: 'mobile'
    });

  };


  let clientX = -100;
  let clientY = -100;
  const innerCursor = document.querySelector(".cursor--small");

  const initCursor = () => {
    document.addEventListener("mousemove", e => {
      clientX = e.clientX;
      clientY = e.clientY;
    });
    
    const render = () => {
      innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  initCursor();

  let lastX = 0;
  let lastY = 0;
  let isStuck = false;
  let showCursor = false;
  let group, stuckX, stuckY, fillOuterCursor;

  const initCanvas = () => {
    const canvas = document.querySelector(".cursor--canvas");
    const shapeBounds = {
      width: 75,
      height: 75
    };
    paper.setup(canvas);
    const strokeColor = "rgba(253, 179, 44, 0.5)";
    const strokeWidth = 1;
    const segments = 8;
    const radius = 20;
    
    const noiseScale = 150;
    const noiseRange = 4;
    let isNoisy = false;
    
    const polygon = new paper.Path.RegularPolygon(
      new paper.Point(0, 0),
      segments,
      radius
    );
    polygon.strokeColor = strokeColor;
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();
    group = new paper.Group([polygon]);
    group.applyMatrix = false;
    
    const noiseObjects = polygon.segments.map(() => new SimplexNoise());
    let bigCoordinates = [];
    
    const lerp = (a, b, n) => {
      return (1 - n) * a + n * b;
    };
    
    const map = (value, in_min, in_max, out_min, out_max) => {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    };
    
    paper.view.onFrame = event => {
      lastX = lerp(lastX, clientX, 0.2);
      lastY = lerp(lastY, clientY, 0.2);
      group.position = new paper.Point(lastX, lastY);
    }

    document.body.addEventListener("mouseover", function(e) {
      if(e.target && (e.target.nodeName == "A" || e.target.className == "folio-list__item-pic" || e.target.className == "folio-list__item-text" || e.target.className == "folio-list__item-cat" || e.target.className == "folio-list__item-title" || e.target.className == "services-list__item-header" || e.target.className == "services-list__item-header__h5")) {
        polygon.strokeColor = "rgba(237, 29, 35, 0.5)";
        polygon.strokeWidth = 2;
        document.querySelector(".cursor--small").classList.add("hovered");
      }
    });

    document.body.addEventListener("mouseout", function(e) {
      if(e.target && (e.target.nodeName == "A" || e.target.className == "folio-list__item-pic" || e.target.className == "folio-list__item-text" || e.target.className == "folio-list__item-cat" || e.target.className == "folio-list__item-title" || e.target.className == "services-list__item-header" || e.target.className == "services-list__item-header__h5")) {
        polygon.strokeColor = "rgba(253, 179, 44, 0.5)";
        polygon.strokeWidth = 1;
        document.querySelector(".cursor--small").classList.remove("hovered");
      }
    });
  }

  initCanvas();
  
  const tl = anime.timeline( {
      easing: 'easeInOutCubic',
      duration: 800,
      autoplay: false
  })
  .add({
      targets: '#loader',
      opacity: 0,
      duration: 1000,
      begin: function(anim) {
          window.scrollTo(0, 0);
      }
  })
  .add({
      targets: '#preloader',
      opacity: 0,
      complete: function(anim) {
          document.querySelector("#preloader").style.visibility = "hidden";
          document.querySelector("#preloader").style.display = "none";
      }
  })
  .add({
      targets: '.s-header',
      translateY: [-100, 0],
      opacity: [0, 1]
  }, '-=200')
  .add({
      targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],
      translateX: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(400)
  })
  .add({
      targets: '.branding',
      keyframes: [
          {opacity: [0, 1]}
      ],
      delay: anime.stagger(100, {direction: 'reverse'})
  })
  .add({
      targets: '.intro-social li',
      translateX: [-50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, {direction: 'reverse'})
  })
  .add({
      targets: '.intro-scrolldown',
      translateY: [100, 0],
      opacity: [0, 1]
  }, '-=800');

  const ssPreloader = function() {

      const preloader = document.querySelector('#preloader');
      if (!preloader) return;
      
      window.addEventListener('load', function() {
          document.querySelector('html').classList.remove('ss-preload');
          document.querySelector('html').classList.add('ss-loaded');

          document.querySelectorAll('.ss-animated').forEach(function(item){
              item.classList.remove('ss-animated');
          });

          tl.play();
      });

      window.addEventListener('beforeunload' , function () {
        window.scrollTo(0, 0);
      });

  };
  

  const ssMobileMenu = function() {

      const toggleButton = document.querySelector('.mobile-menu-toggle');
      const mainNavWrap = document.querySelector('.main-nav-wrap');
      const siteBody = document.querySelector("body");

      if (!(toggleButton && mainNavWrap)) return;

      toggleButton.addEventListener('click', function(event) {
          event.preventDefault();
          toggleButton.classList.toggle('is-clicked');
          siteBody.classList.toggle('menu-is-open');
      });

      mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
          link.addEventListener("click", function(event) {

              if (window.matchMedia('(max-width: 800px)').matches) {
                  toggleButton.classList.toggle('is-clicked');
                  siteBody.classList.toggle('menu-is-open');
              }
          });
      });

      window.addEventListener('resize', function() {

          if (window.matchMedia('(min-width: 801px)').matches) {
              if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
              if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
          }
      });

  };
  

  const ssScrollSpy = function() {

      const sections = document.querySelectorAll(".target-section");

      window.addEventListener("scroll", navHighlight);

      function navHighlight() {
          let scrollY = window.pageYOffset;
      
          sections.forEach(function(current) {
              const sectionHeight = current.offsetHeight;
              const sectionTop = current.offsetTop - 50;
              const sectionId = current.getAttribute("id");
          
              if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                  document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
              } else {
                  document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
              }
          });
      }

  };
  

  const ssViewAnimate = function() {

      const blocks = document.querySelectorAll("[data-animate-block]");

      window.addEventListener("scroll", viewportAnimation);

      function viewportAnimation() {

          let scrollY = window.pageYOffset;

          blocks.forEach(function(current) {

              const viewportHeight = window.innerHeight;
              const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
              const blockHeight = current.offsetHeight;
              const blockSpace = triggerTop + blockHeight;
              const inView = scrollY > triggerTop && scrollY <= blockSpace;
              const isAnimated = current.classList.contains("ss-animated");

              if (inView && (!isAnimated)) {
                  anime({
                      targets: current.querySelectorAll("[data-animate-el]"),
                      opacity: [0, 1],
                      translateY: [100, 0],
                      delay: anime.stagger(400, {start: 200}),
                      duration: 800,
                      easing: 'easeInOutCubic',
                      begin: function(anim) {
                          current.classList.add("ss-animated");
                      }
                  });
              }
          });
      }

  };
  

  const ssSwiper = function() {

      const mySwiper = new Swiper('.swiper-container', {

          slidesPerView: 1,
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          },
          autoplay: {
            delay: 9000,
            disableOnInteraction: true,
          },
       });

  };
  

  const ssLightbox = function() {

      const folioLinks = document.querySelectorAll('.folio-list__item-link');
      const modals = [];

      folioLinks.forEach(function(link) {
          let modalbox = link.getAttribute('href');
          let instance = basicLightbox.create(
              document.querySelector(modalbox),
              {
                  onShow: function(instance) {
                      document.addEventListener("keydown", function(event) {
                          event = event || window.event;
                          if (event.keyCode === 27) {
                              instance.close();
                          }
                      });
                  }
              }
          )
          modals.push(instance);
      });

      folioLinks.forEach(function(link, index) {
          link.addEventListener("click", function(event) {
              event.preventDefault();
              modals[index].show();
          });
      });

  };
  

  const pdfLightbox = function() {

    const pdfLinks = document.querySelectorAll('.link-see-pdf');
    const pdfFiles = ['resume','recommendation__tefl','recommendation__imm'];

    pdfLinks.forEach(function(link, index) {
      link.addEventListener("click", function(event) {
        basicLightbox.create("<iframe width='90%' height='95%' src='/pdf/sara_kozinska__developer-" + pdfFiles[index] + ".pdf' style='max-width: 1000px' frameborder='0' allowfullscreen></iframe>").show();
      });
    });

};

function handleClass(node, className, action = "add") {
  node.classList[action](className);
}

const ssAccordion = function() {
  const allServices  = document.querySelectorAll('.services-list__item');

  allServices.forEach(function(link, index) {

    const heading = link.querySelector(".services-list__item-header");
    const accordionContentWrap = link.querySelector(".services-list__item-body");
    const originalHeight = accordionContentWrap.offsetHeight;
    accordionContentWrap.style.height = 0;

    heading.addEventListener("click", function () {
      if (this.parentNode.classList.contains("is-active")) {
        handleClass(this.parentNode, "is-active", "remove");
        accordionContentWrap.style.height = 0 + "px";
      } else {
        handleClass(this.parentNode, "is-active");
        accordionContentWrap.style.height = "auto";
      }
    });
    
  });

};

  const ssTerminal = function() {

    const terminal = document.querySelector('.terminal');
    const terminalMesages = ['Thank you for interest in my skills and going thru my website!', 'I have (i hope) good news for you!', 'I am open for work!'];

    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  
      );
    }

    var fnFired = 0;
    function typeMessage() {
      if(fnFired == 0){

        setTimeout(function() {
          var typed = new Typed('.shell--0', {
            strings: ['<i>$</i> Hello you!'],
            onComplete: function() {
              setTimeout(function() {

                document.querySelectorAll(".typed-cursor").forEach(el => el.remove());
                var typed1 = new Typed('.shell--1', {
                  strings: ['<i>$</i> I am glad you stopped by!'],
                  onComplete: function() {

                    document.querySelectorAll(".typed-cursor").forEach(el => el.remove());
                    setTimeout(function() {
                      var typed2 = new Typed('.shell--2', {
                        strings: ['<i>$</i> Looks like you are searching for a developer...'],
                        onComplete: function() {
    
                          document.querySelectorAll(".typed-cursor").forEach(el => el.remove());
                          setTimeout(function() {
                            var typed3 = new Typed('.shell--3', {
                              strings: ['<i>$</i> That is amazing, since I always welcome a new challenge!'],
                              onComplete: function() {
    
                                document.querySelectorAll(".typed-cursor").forEach(el => el.remove());
                                setTimeout(function() {
                                  var typed4 = new Typed('.shell--4', {
                                    strings: ["<i>$</i> Let's get creative together."],
                                    onComplete: function() {
          
                                      document.querySelectorAll(".typed-cursor").forEach(el => el.remove());
                                      setTimeout(function() {
                                        var typed5 = new Typed('.shell--5', {
                                          strings: ['<i>$</i> Drop me an e-mail, ping me on skype or simply call me!']
                                        });
                                      }, 2000);
                
                                    }
                                  });
                                }, 2000);
          
                              }
                            });
                          }, 2000);
    
                        }
                      });
                    }, 2000);

                  }
                });

              }, 2000);
            }
          });
        }, 1300);
        
        fnFired = 1;
      }
    }

    document.addEventListener('scroll', function () {
      const terminalStatus = isInViewport(terminal) ? '1' : '0';
      if (terminalStatus == 1) {
        terminal.style.opacity = '1';
        typeMessage();
      } else {
        terminal.style.opacity = '0';
      }
    }, {
      passive: true
    });

    

  };
  
  const ssAlertBoxes = function() {

      const boxes = document.querySelectorAll('.alert-box');

      boxes.forEach(function(box){

          box.addEventListener('click', function(event) {
              if (event.target.matches(".alert-box__close")) {
                  event.stopPropagation();
                  event.target.parentElement.classList.add("hideit");

                  setTimeout(function(){
                      box.style.display = "none";
                  }, 500)
              }    
          });

      })

  };
  
  const ssMoveTo = function(){

      const easeFunctions = {
          easeInQuad: function (t, b, c, d) {
              t /= d;
              return c * t * t + b;
          },
          easeOutQuad: function (t, b, c, d) {
              t /= d;
              return -c * t* (t - 2) + b;
          },
          easeInOutQuad: function (t, b, c, d) {
              t /= d/2;
              if (t < 1) return c/2*t*t + b;
              t--;
              return -c/2 * (t*(t-2) - 1) + b;
          },
          easeInOutCubic: function (t, b, c, d) {
              t /= d/2;
              if (t < 1) return c/2*t*t*t + b;
              t -= 2;
              return c/2*(t*t*t + 2) + b;
          }
      }

      const triggers = document.querySelectorAll('.smoothscroll');
      
      const moveTo = new MoveTo({
          tolerance: 0,
          duration: 1200,
          easing: 'easeInOutCubic',
          container: window
      }, easeFunctions);

      triggers.forEach(function(trigger) {
          moveTo.registerTrigger(trigger);
      });

  };

  (function ssInit() {

      ssPreloader();
      ssMobileMenu();
      ssScrollSpy();
      ssViewAnimate();
      ssSwiper();
      ssLightbox();
      pdfLightbox();
      ssAccordion();
      ssAlertBoxes();
      ssTerminal();
      ssMoveTo();
      ssAOS();

  })();

  ssInit();

})(document.documentElement);