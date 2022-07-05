document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });
});



const books = [];
const RENDER_EVENT = 'render-todo';


const generateId = () => {
    return +new Date();
}


const generateBookObject = (id, title, author, year, isFinished) => {
    return {
        id,
        title,
        author,
        year,
        isFinished
    }
}


const addBook = () => {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, false);

    books.push(bookObject);

    document.dispatchEvent(new Event (RENDER_EVENT));
}


document.addEventListener(RENDER_EVENT, () => {
    console.log(books);

});