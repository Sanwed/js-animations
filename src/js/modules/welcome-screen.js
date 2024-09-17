import {gsap} from 'gsap';
import MainScreen from './main-screen';
import arrowSrc from '../../assets/images/arrow.svg';

class WelcomeScreen {
  init() {
    const body = document.body;
    
    const screenParent = this.#createElement('div', {classname: 'screen welcome-screen', id: 'welcome-screen'});
    const title = this.#createElement('h1', {textContent: 'Welcome', id: 'welcome-title'});
    const arrow = this.#createElement('button', {id: 'welcome-arrow'});
    
    const arrowSvg = document.createElement('img');
    arrowSvg.src = `${arrowSrc}`;
    
    body.append(screenParent);
    screenParent.append(title, arrow);
    arrow.append(arrowSvg);
    
    this.#showScreen(screenParent, title, arrow);
  }
  
  #createElement(tag, {classname, id, textContent} = {}) {
    const elem = document.createElement(tag);
    if (classname) elem.className = classname;
    if (id) elem.id = id;
    if (textContent) elem.textContent = textContent;
    return elem;
  }
  
  #showScreen(screen, title, arrow) {
    const tl = gsap.timeline({
      defaults: {duration: 2, opacity: 0},
    });
    tl.from(screen, {y: -screen.offsetHeight, ease: 'power2.out'})
      .from(title, {y: -title.offsetHeight}, '<')
      .from(arrow, {
        duration: 1, y: -arrow.offsetHeight, onComplete: () => {
          arrow.style.cursor = 'pointer';
          const slideTl = this.#slideArrow(arrow);
          this.#clickArrow(slideTl, screen, title, arrow);
        },
      }, '<1');
  }
  
  #slideArrow(arrow) {
    const tl = gsap.timeline({repeat: -1, repeatDelay: 0, yoyo: true});
    tl.to(arrow, {duration: 1, y: arrow.offsetHeight / 5});
    return tl;
  }
  
  #clickArrow(tlToKill, screen, title, arrow) {
    const tl = gsap.timeline({
      paused: true, onComplete: () => {
        screen.remove();
      },
    });
    tl.to(screen, {
      duration: 2, y: -screen.offsetHeight, ease: 'power2.out',
    })
      .to(title, {duration: 1, y: -screen.offsetHeight / 4}, '<')
      .to(arrow, {duration: 1, y: -40, opacity: 0}, '<');
    arrow.addEventListener('click', () => {
      tlToKill.kill(arrow);
      tl.play();
      new MainScreen().init();
    });
  }
}

export default WelcomeScreen;
