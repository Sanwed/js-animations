class Gallery {
  constructor(body) {
    this.body = body;
  }
  
  init() {
    const parent = document.createElement('div');
    parent.classList.add('gallery');
    
    this.body.append(parent);
  }
}
export default Gallery;
