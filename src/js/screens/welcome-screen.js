import {gsap} from 'gsap';

class WelcomeScreen {
  createScreen() {
    const body = document.body;
    
    const screenParent = document.createElement('div');
    screenParent.classList = 'screen welcome-screen';
    screenParent.id = 'welcome-screen';
    body.append(screenParent);
    this.#showScreen(screenParent);
    
    const title = document.createElement('h1');
    title.textContent = 'Welcome';
    title.id = 'welcome-title';
    screenParent.append(title);
    this.#showTitle(title);
    
    const arrow = document.createElement('button');
    arrow.id = 'welcome-arrow';
    screenParent.append(arrow);
    this.#showArrow(arrow, screenParent);
    
    const arrowSvg = document.createElement('img');
    arrowSvg.src = 'assets/images/arrow.svg';
    arrow.append(arrowSvg);
  }
  
  #showScreen(screen) {
    const screenHeight = screen.offsetHeight;
    gsap.from('#welcome-screen', {opacity: 0, y: -screenHeight, duration: 2, ease: 'power2.out'});
  }
  
  #showTitle(title) {
    const titleHeight = title.offsetHeight;
    gsap.from('#welcome-title', {opacity: 0, y: -titleHeight, duration: 2});
  }
  
  #showArrow(arrow, screen) {
    const arrowHeight = arrow.offsetHeight;
    gsap.from('#welcome-arrow', {duration: 2, opacity: 0, y: -arrowHeight});
    
    const hoverAnimation = gsap.to('#welcome-arrow', {
      height: arrowHeight + 40, duration: 1, paused: true,
    });
    arrow.addEventListener('mouseenter', () => hoverAnimation.play());
    arrow.addEventListener('mouseleave', () => hoverAnimation.reverse());
    
    const screenHeight = screen.offsetHeight;
    const switchScreenAnimation = gsap.to('#welcome-screen', {
      y: -screenHeight, duration: 2, ease: 'power2.out', paused: true,
    });
    
    const arrowHideAnimation = gsap.to('#welcome-arrow', {
      opacity: 0, duration: 0.5, paused: true,
    });
    
    arrow.addEventListener('click', () => {
      arrowHideAnimation.play();
      switchScreenAnimation.play();
    });
  }
}

export default WelcomeScreen;
