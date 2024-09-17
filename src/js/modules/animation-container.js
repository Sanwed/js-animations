import {gsap} from 'gsap';
import Gallery from './gallery';

class AnimationContainer {
  constructor(animationId) {
    this.animationId = animationId;
  }
  
  init() {
    const body = document.body;
    
    const modal = document.createElement('div');
    modal.id = 'animation-modal';
    modal.classList.add('modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-button');
    
    const leftBtnPart = document.createElement('div');
    leftBtnPart.classList.add('left');
    const rightBtnPart = document.createElement('div');
    rightBtnPart.classList.add('right');
    
    body.append(modal);
    modal.append(modalContent);
    modal.append(closeBtn);
    closeBtn.append(leftBtnPart);
    closeBtn.append(rightBtnPart);
    
    this.#showScreen(modal, modalContent, closeBtn, leftBtnPart, rightBtnPart);
  }
  
  #showScreen(...elems) {
    const [screen, content, btn, leftPart, rightPart] = elems;
    const tl = gsap.timeline({
      onComplete: () => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
          this.#hideScreen(...elems);
        });
      },
    });
    tl.from(screen, {
      opacity: 0, duration: 1,
    });
    tl.from(content, {
      duration: 1, opacity: 0, scale: 0, borderRadius: 200,
    }, '<0.5');
    tl.from(leftPart, {
      opacity: 0, duration: 1, ease: 'power2.out', x: -100, y: -100,
    }, '<0.5');
    tl.from(rightPart, {
      opacity: 0, duration: 1, ease: 'power2.out', x: 100, y: -100,
      onComplete: () => {
        new Gallery(content).init();
      },
    }, '<');
  }
  
  #hideScreen(screen) {
    const tl = gsap.timeline();
    tl.to(screen, {
      opacity: 0, duration: 1, onComplete: () => {
        screen.remove();
      },
    });
  }
}

export default AnimationContainer;
