document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
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
    const checkBox = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, inputTitle, inputAuthor, inputYear, checkBox);

    books.push(bookObject);

    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
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

    if (bookObject.isFinished) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener('click', () => {
            undoBookFromComplete(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener('click', () => {
            removeBookFromComplete(bookObject.id);
        });

        const containerButton = document.createElement('div');
        containerButton.classList.add('action');
        containerButton.append(undoButton, trashButton);
        container.append(containerButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = "Selesai dibaca";
        checkButton.addEventListener('click', () => {
            addBookToComplete(bookObject.id)
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = "Hapus buku";
        trashButton.addEventListener('click', () => {
            removeBookFromComplete(bookObject.id);
        });
        const containerButton = document.createElement('div');
        containerButton.classList.add('action');
        containerButton.append(checkButton, trashButton);
        container.append(containerButton);
    }
    return container;
}



const addBookToComplete = (bookId) => {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isFinished = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}


const removeBookFromComplete = (bookId) => {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1);
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


const undoBookFromComplete = (bookId) => {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return;

    bookTarget.isFinished = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}


// STORAGE
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOKSHELF';

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}


// searchbox
const searchButton = document.getElementById('searchSubmit');
const searchValue = document.getElementById('searchBookTitle');

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem(STORAGE_KEY) == "") {
        alert("Tidak ada data buku");
        return location.reload();
    } else {
        const getByTitle = getData().filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author == searchValue.value.trim());
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year == searchValue.value.trim());
                if (getByYear.length == 0) {
                    alert("Data yang anda cari tidak ada");
                    return location.reload();
                } else {
                    showSearchResult(getByYear);
                }
            } else {
                showSearchResult(getByAuthor);
            }
        } else {
            showSearchResult(getByTitle);
        }
    }
});

const getData = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

const showSearchResult = (books) => {
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = "";

    books.forEach(book => {
        let show = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.year}</p>
            <p>${book.isFinished ? 'Sudah dibaca' : 'Belum selesai dibaca'}</p>
        </article>
        `
        searchResult.innerHTML += show;
    });
}