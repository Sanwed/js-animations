import {gsap} from 'gsap';
import AnimationContainer from './animation-container';
import Gallery from './gallery';

class MainScreen {
  constructor(animationsLink) {
    this.animationsLink = animationsLink || ['Animation 1', 'Animation 2', 'Animation 3', 'Animation 4'];
  }
  
  init() {
    const body = document.body;
    
    const screenParent = document.createElement('div');
    screenParent.classList = 'screen main-screen';
    screenParent.id = 'main-screen';
    
    const title = document.createElement('h1');
    title.textContent = 'Animations';
    title.id = 'main-title';
    
    const list = document.createElement('ul');
    list.classList.add('animation-list');
    
    this.animationsLink.forEach((animation) => {
      const item = document.createElement('li');
      item.classList.add('animation-item');
      item.id = 'animation-item-' + animation;
      
      const header = document.createElement('header');
      
      const title = document.createElement('h2');
      title.textContent = animation.toString();
      
      const subtitle = document.createElement('span');
      subtitle.textContent = 'gsap';
      
      const overlay = document.createElement('div');
      overlay.classList.add('overlay');
      
      list.append(item);
      item.append(header);
      header.append(title);
      header.append(subtitle);
      item.append(overlay);
    });
    
    body.append(screenParent);
    screenParent.append(title);
    screenParent.append(list);
    
    const items = list.querySelectorAll('li');
    this.#showScreen(screenParent, title, items);
    
  }
  
  #showScreen(...elems) {
    const [screen, title, items] = elems;
    const tl = gsap.timeline({});
    tl.fromTo(screen,
      {opacity: 0, duration: 2, ease: 'power2.out', y: screen.offsetHeight},
      {opacity: 1, y: 0, duration: 2});
    tl.from(title, {
      opacity: 0,
      x: -title.offsetWidth,
    }, '<1');
    tl.from(items, {
      opacity: 0,
      x: -items[0].offsetWidth,
      stagger: 0.1,
      onComplete: () => {
        items.forEach(card => {
          card.style.cursor = 'pointer';
          const header = card.querySelector('header');
          gsap.set([card, header], {
            transformPerspective: 900,
            transformOrigin: 'center center',
          });
          card.addEventListener('mousemove', (evt) => {
            this.#tiltElem(evt, card);
            this.#tiltElem(evt, header, 10);
          });
          card.addEventListener('mouseleave', () => {
            this.#resetTiltAnimation(card, header);
          });
          card.addEventListener('click', (_, i) => {
            new AnimationContainer(i).init();
          });
        });
      },
    }, '<');
  }
  
  #tiltElem(evt, elem, spread = 0) {
    let xPos = (evt.clientX / window.innerWidth - 0.5);
    let yPos = (evt.clientY / window.innerHeight - 0.5);
    gsap.to(elem, {
      duration: 0.1,
      rotationY: 10 * xPos,
      rotationX: 10 * yPos,
      x: spread * xPos,
      y: spread * yPos,
      overwrite: true,
    });
  }
  
  #resetTiltAnimation(...elems) {
    gsap.to(elems, {
      duration: 0.2,
      rotationY: 0,
      rotationX: 0,
      x: 0,
      y: 0,
    });
  }
}

export default MainScreen;
