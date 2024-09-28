import {gsap} from 'gsap';
import {createElement} from '../utils';
import ImagesList from './images-list';

class Gallery {
  constructor(body) {
    this.body = body;
    this.imagesList = new ImagesList();
    
    this.container = null;
    this.leftButton = null;
    this.rightButton = null;
    
    this.startX = 0;
    this.endX = 0;
    this.isParralaxActive = true;
    
    this.imageCache = {};
    
  }
  
  init() {
    this.createScreen();
    this.showScreen();
  }
  
  createScreen() {
    this.container = createElement('div', {className: 'gallery'});
    
    this.leftButton = createElement('button', {className: 'gallery-button-left'});
    const leftButtonArrow = createElement('img', {src: './assets/images/arrow-slider.svg', alt: 'arrow-left'});
    this.leftButton.append(leftButtonArrow);
    
    this.rightButton = createElement('button', {className: 'gallery-button-right'});
    const rightButtonArrow = createElement('img', {src: './assets/images/arrow-slider.svg', alt: 'arrow-right'});
    this.rightButton.append(rightButtonArrow);
    
    this.container.append(this.leftButton, this.rightButton);
    this.body.append(this.container);
  }
  
  showScreen() {
    const tl = gsap.timeline({defaults: {opacity: 0}});
    tl.from(this.container, {duration: 0, ease: 'power2.out', scale: 0})
      .from(this.leftButton, {x: -this.leftButton.offsetWidth, ease: 'power2.out', duration: 0.5}, '0.2')
      .from(this.rightButton, {
        x: this.rightButton.offsetWidth,
        ease: 'power2.out',
        duration: 0.5,
        onComplete: this.setupItemInteractions.bind(this),
      }, '0.3');
  }
  
  setupItemInteractions() {
    this.leftButton.style.cursor = 'pointer';
    this.rightButton.style.cursor = 'pointer';
    
    this.hoverButtons();
    
    this.createImages();
    
    this.current = this.imageFromDir();
    this.rightButton.addEventListener('click', () => {
      this.imagesList.moveNext();
      this.current = this.swipe(false);
    });
    
    this.leftButton.addEventListener('click', () => {
      this.imagesList.movePrev();
      this.current = this.swipe(true);
    });
    
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handleMoveEnd.bind(this));
    
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.body.addEventListener('mouseup', this.handleMoveEnd.bind(this));
  }
  
  handleTouchStart(evt) {
    this.startX = evt.touches[0].clientX;
  }
  
  handleTouchMove(evt) {
    this.endX = evt.touches[0].clientX;
    let offset = -(this.startX - this.endX);
    if (offset < -50) {
      offset = -50;
    } else if (offset > 50) {
      offset = 50;
    }
    gsap.to(this.current, {x: offset, rotate: offset / 20, duration: 0.2});
  }
  
  handleMoveEnd() {
    if (this.startX - this.endX > 100) {
      this.imagesList.moveNext();
      this.current = this.swipe(false);
    } else if (this.endX - this.startX > 100) {
      this.imagesList.movePrev();
      this.current = this.swipe(true);
    } else {
      gsap.to(this.current, {
        x: 0, rotate: 0, duration: 0.2, onComplete: () => {
          this.isParralaxActive = true;
        },
      });
    }
    this.isMouseDown = false;
    
  }
  
  handleMouseDown(evt) {
    this.startX = evt.clientX;
    this.isMouseDown = true;
    this.isParralaxActive = false;
  }
  
  handleMouseMove(evt) {
    this.endX = evt.clientX;
    if (this.isMouseDown) {
      let offset = -(this.startX - this.endX);
      if (offset < -50) {
        offset = -50;
      } else if (offset > 50) {
        offset = 50;
      }
      gsap.to(this.current, {x: offset, rotate: offset / 20, duration: 0.2});
    }
  }
  
  createImages() {
    for (let i = 1; i <= 5; i++) {
      this.imagesList.append(`./assets/images/gallery/${i}.jpg`);
    }
  }
  
  swipe(toLeft) {
    const imageContainer = document.querySelector('.gallery-image');
    imageContainer.style.pointerEvents = 'none';
    this.imageToDir(this.current, !toLeft);
    return this.imageFromDir(toLeft);
  }
  
  hoverButtons() {
    const tl = gsap.timeline({defaults: {scale: 1.1, paused: true, backgroundColor: '#aba9ff'}});
    const hoverLeft = tl.to(this.leftButton, {});
    const hoverRight = tl.to(this.rightButton, {});
    
    this.rightButton.addEventListener('mouseenter', () => hoverRight.play());
    this.rightButton.addEventListener('mouseleave', () => hoverRight.reverse());
    
    this.leftButton.addEventListener('mouseenter', () => hoverLeft.play());
    this.leftButton.addEventListener('mouseleave', () => hoverLeft.reverse());
  }
  
  parallax(evt, elem, spread = 0) {
    gsap.set(elem, {
      perspective: 1100, transformOrigin: '50% 50%',
    });
    const xPos = (evt.clientX / window.innerWidth - 0.5);
    const yPos = (evt.clientY / window.innerHeight - 0.5);
    gsap.to(elem, {
      duration: 0.3, x: -spread * xPos * 10, y: -spread * yPos * 10, ease: 'power2.out', overwrite: true,
    });
  }
  
  resetParallax(...elems) {
    gsap.to(elems, {duration: 0.4, x: 0, y: 0});
  }
  
  imageFromDir(fromLeft = false) {
    const imgContainer = createElement('div', {className: 'gallery-image'});
    
    const currentImageSrc = this.imagesList.currentNode;
    if (this.imageCache[currentImageSrc]) {
      const cachedImage = this.imageCache[currentImageSrc];
      imgContainer.append(cachedImage);
      this.container.append(imgContainer);
      this.setupImageAnimation(imgContainer, fromLeft);
      return imgContainer;
    }
    
    const image = createElement('img', {src: this.imagesList.currentNode});
    image.width = image.naturalWidth;
    image.height = image.naturalHeight;
    
    this.showLoadingWheel();
    
    image.addEventListener('error', () => {
      this.hideLoadingWheel(false);
      
      const errMessage = createElement('span', {className: 'error-message', textContent: 'Failed to load content'});
      this.container.append(errMessage);
      
      const btn = createElement('button', {className: 'try-again-button', textContent: 'Try Again'});
      btn.addEventListener('click', () => {
        errMessage.remove();
        btn.remove();
        this.current = this.imageFromDir();
      });
      this.container.append(btn);
    });
    
    image.addEventListener('load', () => {
      this.hideLoadingWheel(true);
      imgContainer.append(image);
      
      this.imageCache[currentImageSrc] = image;
      
      this.container.append(imgContainer);
      this.setupImageAnimation(imgContainer, fromLeft);
    });
    
    return imgContainer;
  }
  
  setupImageAnimation(imgContainer, fromLeft) {
    const dir = fromLeft ? -imgContainer.offsetWidth : imgContainer.offsetWidth;
    const tl = gsap.timeline();
    tl.from(imgContainer, {
      x: dir,
      rotate: fromLeft ? -45 : 45,
      duration: 1,
      opacity: 0,
      scale: 0.8,
      delay: 0.5,
      ease: 'back',
      y: imgContainer.offsetHeight / 5,
      onComplete: () => {
        imgContainer.addEventListener('mousemove', (evt) => {
          if (this.isParralaxActive) {
            this.parallax(evt, imgContainer, 3);
          }
        });
        imgContainer.addEventListener('mouseleave', () => {
          if (this.isParralaxActive) {
            this.resetParallax(imgContainer);
          }
        });
      },
    });
  }
  
  showLoadingWheel() {
    const wheel = createElement('div', {className: 'loading-wheel'});
    
    for (let i = 0; i < 4; i++) {
      const round = createElement('div', {className: 'loading-round'});
      wheel.append(round);
    }
    
    this.container.append(wheel);
    
    this.leftButton.style.pointerEvents = 'none';
    this.rightButton.style.pointerEvents = 'none';
    
    const tl = gsap.timeline({delay: 1});
    tl.from(wheel, {opacity: 0, duration: 0.2});
    tl.to(wheel, {
      duration: 1, ease: 'power2.out', rotate: 180, repeat: -1, yoyo: true,
    });
  }
  
  hideLoadingWheel(isSuccess) {
    if (isSuccess) {
      this.leftButton.style.pointerEvents = 'all';
      this.rightButton.style.pointerEvents = 'all';
    }
    
    const wheel = document.querySelector('.loading-wheel');
    gsap.to(wheel, {opacity: 0, duration: 0.2, onComplete: () => wheel && wheel.remove()});
  }
  
  imageToDir(imgContainer, toLeft = false) {
    const dir = toLeft ? -imgContainer.offsetWidth : imgContainer.offsetWidth;
    
    const tl = gsap.timeline();
    tl.to(imgContainer, {
      x: dir,
      rotate: toLeft ? -45 : 45,
      duration: 0.5,
      scale: 0.8,
      opacity: 0,
      ease: 'back.in',
      y: imgContainer.offsetHeight / 5,
      onComplete: () => {
        imgContainer.remove();
      },
    });
  }
}

export default Gallery;
