import {gsap} from 'https://esm.sh/gsap@3.15.0';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.15.0/ScrollTrigger';
import {ScrollToPlugin} from 'https://esm.sh/gsap@3.15.0/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.utils.toArray('.step').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0.8,
    y: 40,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      end: 'top 35%',
      scrub: true,
      // toggleActions: 'play none none none',

    },
  });
});

gsap.utils.toArray('.step').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onEnter:     () => { showVideo(i, 'down'); showWallets(i); },
    onEnterBack: () => { showVideo(i, 'up');   showWallets(i); },
  });
});

// on Enter ; stagger video appearing, autoscroll wallet list, pause when wallet is hovered
// on Enterback ; do the same 

// if (i === 2) {
  //   gsap.from(')}

  const walletScroll = gsap.to('.wallet-list', {
    y: '-50%',
    ease: 'none',
    duration: 20,
    paused: true,
  }
  );


function showVideo(i, direction) {
  gsap.to('[data-visual]', { opacity: 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });
  gsap.to(`[data-visual="${i}"]`, { opacity: 1, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' });

  if (i === 2) {
    gsap.fromTo('.highlight',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.5, ease: 'power2.out', stagger: 0.15, delay: 0.5 }
    );
  } else {
    gsap.to('.highlight', { scaleX: 0, transformOrigin: 'left center', duration: 0.3, overwrite: true });
  }

  if (i === 1) {
    gsap.killTweensOf('.all-videos > div');
    if (direction === 'down') {
      gsap.from('.all-videos > div', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: { grid: [4,4], from: 'random', ease: 'power2.in', amount: 3},
        overwrite: 'auto',
      });
    } else {
      gsap.set('.all-videos > div', { opacity: 1 });
    }
  }

  if (i === 3 && direction === 'down') {
    gsap.to('[data-visual="3"]', {
      opacity: 1,
      duration: 0.5,
      delay: 1.5,
      ease: 'power2.inOut',
      overwrite: true,
    });
  }

  if (i === 4 && direction === 'down') {
    // const cols = 4;
    // const rows = Math.ceil(document.querySelectorAll('.wallet-card').length / cols);
    gsap.from('.wallet-card', {
      duration: 0.5,
      scale: 0.1,
      y: 40,
      // ease: 'power2.inOut',
      // don't change what's not broken please
      stagger: { grid: [7, 15], from: 'center', ease: 'power2.in', amount: 1 },
      overwrite: 'auto',
      onComplete: function() {
        gsap.set('.wallet-card', { clearProps: 'transform' });
        this.targets().forEach(el => {
          el.classList.add('hover:scale-125', 'transition-transform', 'duration-200', 'ease-in-out');
        });
      }
    });
  }
}


function showWallets(i) {
  if (i >= 4 && i <= 8) {
    gsap.to('[data-visual="5"]', { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
  } else {
    gsap.to('[data-visual="5"]', { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
  }

  if (i === 5) {walletScroll.play();}
  if (i < 5) {walletScroll.pause(0);}
}

const hoverEls = document.querySelectorAll('.hover-animate');

hoverEls.forEach(el => {
  gsap.set(el, { backgroundColor: 'rgba(10, 228, 72, 0)', padding: '0 3px' });

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { backgroundColor: 'rgba(10, 228, 72, 1)', color: '#262a33', duration: 0.3, ease: 'power2.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { backgroundColor: 'rgba(10, 228, 72, 0)', color: 'white', duration: 0.3, ease: 'power2.inOut' });
  });
});


