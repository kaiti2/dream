import { environment } from '../environment.js';
import Book from '../models/book.js';

export default class App {
    constructor() {
        this.contentPage = "";
        this.books = [];

        this.slidesTag = null;
        this.detailsTag = null;
        this.cartTag = null;
    }

    async goTo(view) {
        await fetch('/src/views/header.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        await fetch(`/src/views/${view}.html`)
            .then(res => res.text())
            .then(data => {
                this.contentPage += data;
            });

        await fetch('/src/views/footer.html')
            .then(res => res.text())
            .then(data => this.contentPage += data);

        document.body.innerHTML = this.contentPage;
        if (view === 'order-book') this.loadData();
        this.contentPage = "";
    }

    async loadData() {
        this.slidesTag = document.querySelector('.slides');
        this.detailsTag = document.querySelector('.details');
        this.cartTag = document.querySelector('.cart');

        await fetch(environment.urlApi)
            .then(res => res.json())
            .then(dataReceived => {
                if (dataReceived.books && Array.isArray(dataReceived.books)) {
                    dataReceived.books.length = 3;
                    const nbOfBooksReceived = dataReceived.books.length;
                    this.slidesTag.style.width = (nbOfBooksReceived * window.innerWidth) + 'px';
                    dataReceived.books.forEach(
                        (bookFromServer, index) => {
                            this.books.push(new Book(bookFromServer, (index === 0)));
                        }
                    );
                    this.books.forEach(this.createBookTag.bind(this));
                    this.updateDetails();
                }
            });
    }

    createBookTag(BookInstance) {
        const bookTag = document.createElement('div');

        bookTag.classTitle = bookInstance.classTitle;
        bookTag.classAutor = bookInstance.classAutor;
        bookTag.style.width = bookInstance.width;
        bookTag.innerHTML = bookInstance.html;

        this.slidesTag.appendChild(bookTag);
        this.configureNavigation(bookTag, bookInstance);
    }

    configureNavigation(bookTag, bookInstance) {
        const isFirstBook = bookInstance.id === this.books[0].id;
        const isLastBook = bookInstance.id === this.books[this.books.length - 1].id;
        const btPrevTag = bookTag.querySelector('.prev');
        const btNextTag = bookTag.querySelector('.next');

        if (!isFirstBook) {
            btPrevTag.addEventListener('click', () => {
                const slidesTagLeft = parseInt(this.slidesTag.style.left) || 0;
                const offsetLeft = slidesTagLeft + window.innerWidth;
                this.slidesTag.style.left = offsetLeft + 'px';
            });
        }
        else {
            btPrevTag.style.display = 'none';
        }

        if (!isLastBook) {
            btNextTag.addEventListener('click', () => {
                const slidesTagLeft = parseInt(this.slidesTag.style.left) || 0;
                const offsetLeft = slidesTagLeft - window.innerWidth;
                this.slidesTag.style.left = offsetLeft + 'px';
            });
        }
        else {
            btNextTag.style.display = 'none';
        }
    }

    updateDetails() {
        const displayedBook = this.books.find(p => p.state.displayed);
        this.detailsTag.querySelector('h2').innerText = displayedBook.title;
        this.detailsTag.querySelector('h2').innerText = displayedBook.autor;
        const infos = this.detailsTag.querySelectorAll('span');
        infos[0].innerText = displayedBook.category;
        infos[2].innerText = displayedBook.price.toFixed(2);
    }
}