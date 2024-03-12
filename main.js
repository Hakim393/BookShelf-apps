const bookForm = document.getElementById('inputBook');
const titleInput = document.getElementById('inputBookTitle');
const authorInput = document.getElementById('inputBookAuthor');
const yearInput = document.getElementById('inputBookYear');
const isCompleteInput = document.getElementById('inputBookIsComplete');
const searchForm = document.getElementById('searchBook');
const searchTitleInput = document.getElementById('searchBookTitle');
const unfinishedBooksList = document.getElementById('incompleteBookshelfList');
const finishedBooksList = document.getElementById('completeBookshelfList');

let books = [];

// Function untuk menambahkan buku ke rak yang sesuai
function addBook(title, author, year, isComplete) {
    const book = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };

    books.push(book);
    updateLocalStorage();
    renderBooks();
}

// Function untuk memindahkan buku ke rak lain
function moveBook(id, isComplete) {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index].isComplete = isComplete;
        updateLocalStorage();
        renderBooks();
    }
}

// Function untuk menghapus buku
function removeBook(id) {
    books = books.filter(book => book.id !== id);
    updateLocalStorage();
    renderBooks();
}

// Function untuk render semua buku dirak yang sesuai
function renderBooks(filteredBooks) {
    unfinishedBooksList.innerHTML = '';
    finishedBooksList.innerHTML = '';

    const displayedBooks = filteredBooks || books;

    displayedBooks.forEach(book => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${book.title} by ${book.author} (${book.year})</span>
            <div class="action-buttons">
                <button class="action-button complete" onclick="moveBook(${book.id}, ${!book.isComplete})">
                    ${book.isComplete ? 'Belum Selesai' : 'Selesai Dibaca'}
                </button>
                <button class="action-button delete" onclick="removeBook(${book.id})">Hapus</button>
            </div>
        `;

        if (book.isComplete) {
            finishedBooksList.appendChild(listItem);
        } else {
            unfinishedBooksList.appendChild(listItem);
        }
    });
}

// Function untuk update data di localStorage
function updateLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function untuk handle search
function searchBooks(title) {
    const filteredBooks = books.filter(book => {
        const bookTitle = book.title.toLowerCase();
        const bookAuthor = book.author.toLowerCase();
        const searchTerm = title.toLowerCase();
        return bookTitle.includes(searchTerm) || bookAuthor.includes(searchTerm);
    });

    renderBooks(filteredBooks);
}

// Event listener untuk form submission
bookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = titleInput.value;
    const author = authorInput.value;
    const year = parseInt(yearInput.value);
    const isComplete = isCompleteInput.checked;

    if (title && author && !isNaN(year)) {
        addBook(title, author, year, isComplete);
        titleInput.value = '';
        authorInput.value = '';
        yearInput.value = '';
        isCompleteInput.checked = false;
    } else {
        alert('Harap isi semua kolom dengan benar.');
    }
});

// Event listener untuk mencari form submission
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTitle = searchTitleInput.value;
    searchBooks(searchTitle);
});

function init() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }
    renderBooks();
}

init();
