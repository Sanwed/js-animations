import {gsap} from 'gsap';
import AnimationContainer from './animation-container';
import {createElement, getDeviceType} from './utils';
import animations from './animations';

class MainScreen {
  constructor(body) {
    this.body = body;
    this.container = null;
    this.title = null;
    this.list = null;
    this.items = null;
    
    this.animations = animations;
    
    this.setupItemInteractions = this.setupItemInteractions.bind(this);
    
    this.init();
  }
  
  init() {
    this.createScreen();
    this.showScreen();
  }
  
  createScreen() {
    this.container = createElement('div', {className: 'screen main-screen'});
    this.title = createElement('h1', {textContent: 'Animations'});
    this.list = createElement('ul', {className: 'animation-list'});
    this.animations.forEach(animation => {
      this.list.append(this.createAnimationItem(animation));
    });
    this.items = this.list.children;
    
    this.container.append(this.title, this.list);
    this.body.append(this.container);
  }
  
  createAnimationItem(animation) {
    const item = createElement('li', {className: 'animation-item'});
    const header = createElement('header');
    const title = createElement('h2', {textContent: animation.name});
    const subtitle = createElement('span', {textContent: animation.subtitle});
    const overlay = createElement('div', {className: 'overlay'});
    
    header.append(title, subtitle);
    item.append(header, overlay);
    return item;
  }
  
  showScreen() {
    const tl = gsap.timeline();
    tl.fromTo(this.container, {opacity: 0, y: this.container.offsetHeight}, {opacity: 1, y: 0, duration: 2})
      .from(this.title, {opacity: 0, x: -this.title.offsetWidth}, '<1')
      .from(this.items, {
        opacity: 0, x: -this.items[0].offsetWidth, stagger: 0.1, onComplete: this.setupItemInteractions,
      }, '<');
  }
  
  setupItemInteractions() {
    Array.from(this.items).forEach((card, i) => {
      card.style.cursor = 'pointer';
      const header = card.querySelector('header');
      gsap.set([card, header], {transformPerspective: 900, transformOrigin: 'center center'});
      
      if (!card.dataset.eventAdded) {
        card.addEventListener('mousemove', evt => {
          if (getDeviceType() === 'desktop') {
            this.tiltElem(evt, card);
            this.tiltElem(evt, header, 10);
          }
        });
        
        card.addEventListener('mouseleave', () => {
          if (getDeviceType() === 'desktop') {
            this.resetTiltAnimation(card, header);
          }
        });
        
        card.addEventListener('click', () => new AnimationContainer(document.body, animations[i].animation));
      }
      
      card.dataset.eventAdded = 'true';
    });
  }
  
  tiltElem(evt, elem, spread = 0) {
    const xPos = (evt.clientX / window.innerWidth - 0.5);
    const yPos = (evt.clientY / window.innerHeight - 0.5);
    gsap.to(elem, {
      duration: 0.3,
      rotationY: 10 * xPos,
      rotationX: -10 * yPos,
      x: spread * xPos * 8,
      y: spread * yPos * 8,
      ease: 'power2.out',
      overwrite: true,
    });
  }
  
  resetTiltAnimation(...elems) {
    gsap.to(elems, {duration: 0.4, rotationY: 0, rotationX: 0, x: 0, y: 0});
  }
}

export default MainScreen;
