document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });
});



const books = [];
const RENDER_EVENT = 'render-book';


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
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, inputTitle, inputAuthor, inputYear, false);

    books.push(bookObject);

    document.dispatchEvent(new Event (RENDER_EVENT));
}


document.addEventListener(RENDER_EVENT, () => {
    console.log(books);

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = "";

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if(!bookItem.isFinished) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }

    
});



const makeBook = (bookObject) => {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute('id', `book-${bookObject.id}`);

    return container;
}