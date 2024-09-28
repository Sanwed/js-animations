class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class ImagesList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }
  
  get currentNode() {
    return this.current ? this.current.data : null;
  }
  
  append(...data) {
    if (!data) {
      return;
    }
    data.forEach((item) => {
      const newNode = new Node(item);
      
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
        
        return;
      }
      
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    });
    this.current = this.head;
    this.#createLoop();
  }
  
  #createLoop() {
    if (this.tail) {
      this.tail.next = this.head;
      this.head.prev = this.tail;
    }
  }
  
  moveNext() {
    if (!this.current) {
      return;
    }
    
    this.current = this.current.next;
  }
  
  movePrev() {
    if (!this.current) {
      return;
    }
    this.current = this.current.prev;
  }
}

export default ImagesList;
