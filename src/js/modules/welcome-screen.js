import {gsap} from 'gsap';
import MainScreen from './main-screen';
import {createElement} from './utils';

class WelcomeScreen {
  constructor(body) {
    this.body = body;
    this.container = null;
    this.title = null;
    this.arrow = null;
    
    this.onScreenAppear = this.onScreenAppear.bind(this);
    
    this.init();
  }
  
  init() {
    this.createScreen();
    this.showScreen();
  }
  
  createScreen() {
    this.container = createElement('div', {className: 'screen welcome-screen', id: 'welcome-screen'});
    
    this.title = createElement('h1', {textContent: 'Welcome', id: 'welcome-title'});
    
    this.arrow = createElement('button', {href: '#welcome-arrow'});
    const arrowSvg = createElement('img', {src: './assets/images/arrow.svg', alt: 'arrow'});
    
    this.arrow.append(arrowSvg);
    this.body.append(this.container);
    this.container.append(this.title, this.arrow);
  }
  
  showScreen() {
    const tl = gsap.timeline({defaults: {duration: 2, opacity: 0}, onComplete: this.onScreenAppear});
    tl.from(this.container, {y: -this.container.offsetHeight, ease: 'power2.out'})
      .from(this.title, {y: -this.title.offsetHeight}, '<')
      .from(this.arrow, {duration: 1, y: -this.arrow.offsetHeight}, '<1');
  }
  
  onScreenAppear() {
    this.arrow.style.cursor = 'pointer';
    gsap.timeline({repeat: -1, yoyo: true}).to(this.arrow, {duration: 1, y: this.arrow.offsetHeight / 5});
    this.clickArrow();
  }
  
  clickArrow() {
    const tl = gsap.timeline({
      paused: true, onComplete: () => this.container.remove(),
    });
    tl.to(this.container, {duration: 2, y: -this.container.offsetHeight, ease: 'power2.out'})
      .to(this.title, {duration: 1, y: -this.container.offsetHeight / 4}, '<')
      .to(this.arrow, {duration: 1, y: -40, opacity: 0}, '<');
    
    this.arrow.addEventListener('click', () => {
      tl.play();
      new MainScreen(document.body);
    }, {once: true});
  }
  
}

export default WelcomeScreen;
