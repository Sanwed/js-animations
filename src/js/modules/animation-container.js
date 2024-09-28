import {gsap} from 'gsap';
import {createElement} from './utils';

class AnimationContainer {
  constructor(body, animationClass) {
    this.animationClass = animationClass;
    
    this.body = body;
    this.modal = null;
    this.content = null;
    this.closeButton = null;
    this.leftButtonPart = null;
    this.rightButtonPart = null;
    
    this.onEscapePress = this.onEscapePress.bind(this);
    
    this.init();
  }
  
  init() {
    this.createScreen();
    this.showScreen();
  }
  
  createScreen() {
    this.modal = createElement('div', {className: 'modal'});
    this.content = createElement('div', {className: 'modal-content'});
    this.closeButton = createElement('button', {className: 'close-button'});
    this.leftButtonPart = createElement('div', {className: 'left'});
    this.rightButtonPart = createElement('div', {className: 'right'});
    
    this.closeButton.append(this.leftButtonPart, this.rightButtonPart);
    this.modal.append(this.content, this.closeButton);
    this.body.append(this.modal);
  }
  
  showScreen() {
    const tl = gsap.timeline({
      defaults: {duration: 1, opacity: 0},
      onComplete: () => {
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.addEventListener('click', () => this.hideScreen());
        document.addEventListener('keydown', this.onEscapePress);
      },
    });
    tl.from(this.modal, {
      onComplete: () => new this.animationClass(this.content).init(),
    })
      .from(this.content, {scale: 0, borderRadius: 200, opacity: 1})
      .from(this.leftButtonPart, {ease: 'power2.out', x: -100, y: -100}, '<0.5')
      .from(this.rightButtonPart, {ease: 'power2.out', x: 100, y: -100}, '<');
  }
  
  onEscapePress(evt) {
    return evt.key === 'Escape' && this.hideScreen();
  }
  
  hideScreen() {
    const tl = gsap.timeline();
    tl.to(this.content, {scale: 0, duration: 0.5})
      .to(this.modal, {opacity: 0, duration: 0.5, onComplete: () => this.modal.remove()}, '<');
    document.removeEventListener('keydown', this.onEscapePress);
  }
}

export default AnimationContainer;
