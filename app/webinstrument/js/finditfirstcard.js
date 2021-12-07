class Card {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.r = 16;
    }
  
    suffle(card) {
     
    }
  
    update() {
 
    }
  
    show(p) {
      p.stroke(255);
      p.strokeWeight(2);
      p.fill(255);

      p.push();
      p.translate(this.x, this.y);
    
      p.rect(-this.r , -this.r , this.r, this.r);
      p.pop();
    }

}
  
 