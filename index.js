```javascript
document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const ownBooksList = document.getElementById('ownBooksList');
    const wishlistBooksList = document.getElementById('wishlistBooksList');

    // Load books from local storage when the page loads
    loadBooksFromStorage();

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const bookItem = createBookItem(title, author, description, category === 'wishlist');

        if (category === 'own') {
            insertBookItemAlphabetically(ownBooksList, bookItem);
        } else {
            insertBookItemAlphabetically(wishlistBooksList, bookItem);
        }

        // Save all books to local storage
        saveBooksToStorage();

        bookForm.reset();
    });

    function createBookItem(title, author, description, isWishlist) {
        const bookItem = document.createElement('li');
        const bookInfo = document.createElement('div');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        const editForm = createEditForm(bookItem, title, author, description);

        bookInfo.innerHTML = `<strong>${title}</strong> by ${author}${description ? '<p>' + description + '</p>' : ''}`;

        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            bookItem.remove();
            // Remove the book from local storage
            removeBookFromStorage(bookItem);
            // Save the updated book list to local storage
            saveBooksToStorage();
        });

        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            editForm.style.display = 'flex';
        });

        bookItem.appendChild(bookInfo);
        bookItem.appendChild(deleteButton);
        bookItem.appendChild(editButton);
        bookItem.appendChild(editForm);

        if (isWishlist) {
            const moveButton = document.createElement('button');
            moveButton.textContent = 'Move to Owned';
            moveButton.className = 'move-button';
            moveButton.addEventListener('click', () => {
                bookItem.remove();
                const newBookItem = createBookItem(title, author, description, false);
                insertBookItemAlphabetically(ownBooksList, newBookItem);
                // Update the book category in local storage
                updateBookCategoryInStorage(newBookItem, 'own');
                // Save the updated book list to local storage
                saveBooksToStorage();
            });
            bookItem.appendChild(moveButton);
        }

        return bookItem;
    }

    function createEditForm(bookItem, title, author, currentDescription) {
        const editForm = document.createElement('div');
        editForm.className = 'edit-form';

        const descriptionLabel = document.createElement('label');
        descriptionLabel.textContent = 'Description/Review:';
        
        const descriptionInput = document.createElement('textarea');
        descriptionInput.rows = 4;
        descriptionInput.value = currentDescription;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.type = 'button';
        saveButton.addEventListener('click', () => {
            const newDescription = descriptionInput.value;
            bookItem.querySelector('p') ? bookItem.querySelector('p').textContent = newDescription : bookItem.querySelector('div').innerHTML += `<p>${newDescription}</p>`;
            editForm.style.display = 'none';
            // Update the book description in local storage
            updateBookDescriptionInStorage(bookItem, newDescription);
            // Save the updated book list to local storage
            saveBooksToStorage();
        });

        editForm.appendChild(descriptionLabel);
        editForm.appendChild(descriptionInput);
        editForm.appendChild(saveButton);

        return editForm;
    }

    function insertBookItemAlphabetically(list, bookItem) {
        const title = bookItem.querySelector('strong').textContent.toLowerCase();
        const items = list.querySelectorAll('li');

        let inserted = false;
        for (let i = 0; i < items.length; i++) {
            const itemTitle = items[i].querySelector('strong').textContent.toLowerCase();
            if (title < itemTitle) {
                list.insertBefore(bookItem, items[i]);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            list.appendChild(bookItem);
        }
    }

    function loadBooksFromStorage() {
        const storedBooks = localStorage.getItem('books');
        if (storedBooks) {
            const books = JSON.parse(storedBooks);
            books.forEach(book => {
                const bookItem = createBookItem(book.title, book.author, book.description, book.category === 'wishlist');
                if (book.category === 'own') {
                    ownBooksList.appendChild(bookItem);
                } else {
                    wishlistBooksList.appendChild(bookItem);
                }
            });
        }
    }

    function saveBooksToStorage() {
        const books = [];
        // Iterate through each book item and add its details to the array
        ownBooksList.querySelectorAll('li').forEach(bookItem => {
            const title = bookItem.querySelector('strong').textContent;
            const author = bookItem.querySelector('div').textContent.split('by')[1].trim();
            const description = bookItem.querySelector('p') ? bookItem.querySelector('p').textContent : '';
            books.push({ title, author, description, category: 'own' });
        });
        wishlistBooksList.querySelectorAll('li').forEach(bookItem => {
            const title = bookItem.querySelector('strong').textContent;
            const
