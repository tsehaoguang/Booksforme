document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const ownBooksList = document.getElementById('ownBooksList');
    const wishlistBooksList = document.getElementById('wishlistBooksList');

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
});
