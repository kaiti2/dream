export default class Book {
    constructor({ id, title, autor, category, price }, displayed) {
        this.id = id;
        this.title = title;
        this.autor = autor;
        this.category = category;
        this.price = price;
        this.className = 'book';
        this.width = window.innerWidth + 'px';
        this.html = `
      <h1>${this.name}</h1>
      <div class="controls">
        <div class="prev"></div>
        <div class="next"></div>
      </div>
    `;
        this.state = { displayed };
    }
}