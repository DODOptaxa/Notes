let zIndexCounter = 1;

function toHexColor(color) {
    if (!color) return '#ffffff';
    if (color.startsWith('#')) return color;
    if (color.startsWith('rgb')) {
        const rgb = color.match(/\d+/g).map(Number);
        return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).padStart(6, '0')}`;
    }
    return color; 
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.id = note.id;
    noteDiv.style.left = `${note.x}px`;
    noteDiv.style.top = `${note.y}px`;
    noteDiv.style.zIndex = zIndexCounter++;
    noteDiv.style.backgroundColor = note.color || '#ffffff';

    let isDragging = false;
    let currentX = note.x || 0;
    let currentY = note.y || 0;
    let initialX, initialY;
    let activeNote = null;

    noteDiv.innerHTML = `
    <div class="note-header">
        <div class="color-picker-slot"></div>
        <div class="button-group">
            <button class="delete-btn" onclick="deleteNoteObject('${note.id}')">✕</button>
            <button class="save-btn" onclick="updateNoteObject('${note.id}', this.closest('.note').querySelector('.note-content').value, ${note.x}, ${note.y})">✔</button>
        </div>
    </div>
    <textarea class="note-content">${note.content}</textarea>
    `;

    const headerSlot = noteDiv.querySelector('.color-picker-slot');

    createColorPicker(headerSlot, note.color || '#ffffff', (newColor) => {
        noteDiv.style.backgroundColor = newColor;
        updateNoteObject(note.id, noteDiv.querySelector('.note-content').value, currentX, currentY, newColor);
    });

    function constrainPosition(x, y, noteEl) {
        const containerRect = document.getElementById('noteContainer').getBoundingClientRect();
        const noteWidth = noteEl.offsetWidth;
        const noteHeight = noteEl.offsetHeight;
        const maxX = containerRect.width - noteWidth;
        const maxY = containerRect.height - noteHeight;
        return [Math.max(0, Math.min(x, maxX)), Math.max(0, Math.min(y, maxY))];
    }

    function isNonDraggable(target) {
        return target.classList.contains('note-content') ||
            target.classList.contains('delete-btn') ||
            target.classList.contains('save-btn') ||
            target.classList.contains('color-input') ||
            target.closest('.color-picker-wrapper');
    }

    noteDiv.addEventListener('mousedown', e => {
        if (isNonDraggable(e.target)) return;
        isDragging = true;
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        noteDiv.classList.add('dragging');
        noteDiv.style.zIndex = zIndexCounter++;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            let x = e.clientX - initialX;
            let y = e.clientY - initialY;
            [currentX, currentY] = constrainPosition(x, y, noteDiv);
            noteDiv.style.left = `${currentX}px`;
            noteDiv.style.top = `${currentY}px`;
        }
    });

    document.addEventListener('mouseup', async () => {
        if (isDragging) {
            isDragging = false;
            noteDiv.classList.remove('dragging');
            await updateNote(note.id, noteDiv.querySelector('.note-content').value, currentX, currentY, toHexColor(noteDiv.style.backgroundColor));
        }
    });

    document.addEventListener('touchstart', function (e) {
        const target = e.target.closest('.note');
        if (!target || isNonDraggable(e.target)) {
            if (e.target.classList.contains('delete-btn') ||
                e.target.classList.contains('save-btn') ||
                e.target.classList.contains('color-input') ||
                e.target.closest('.color-picker-wrapper')) {
                e.stopPropagation(); // Зупиняємо поширення події до нотатки
            }
            return;
        }
        activeNote = target;
        const touch = e.touches[0];
        const rect = activeNote.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        activeNote.style.zIndex = zIndexCounter++;
        activeNote.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('touchmove', function (e) {
        if (!activeNote) return;
        const touch = e.touches[0];
        const container = document.getElementById('noteContainer');
        const containerRect = container.getBoundingClientRect();
        let x = touch.clientX - containerRect.left - offsetX;
        let y = touch.clientY - containerRect.top - offsetY;

        x = Math.max(0, Math.min(x, container.offsetWidth - activeNote.offsetWidth));
        y = Math.max(0, Math.min(y, container.offsetHeight - activeNote.offsetHeight));

        activeNote.style.left = `${x}px`;
        activeNote.style.top = `${y}px`;
        e.preventDefault();
    });

    document.addEventListener('touchend', async function () {
        if (activeNote) {
            activeNote.classList.remove('dragging');
            const x = parseFloat(activeNote.style.left);
            const y = parseFloat(activeNote.style.top);
            await updateNote(activeNote.id, activeNote.querySelector('.note-content').value, x, y, toHexColor(activeNote.style.backgroundColor));
            activeNote = null;
        }
    });

    noteDiv.addEventListener('click', (e) => {
        if (isNonDraggable(e.target)) return; // Ігноруємо кліки на кнопках і вибірнику кольору
        noteDiv.style.zIndex = zIndexCounter++;
    });

    return noteDiv;
}

function displayNotes(notes, container) {
    container.querySelectorAll('.note').forEach(note => note.remove());
    notes.forEach(note => container.appendChild(createNoteElement(note)));
}

function deleteNoteElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function updateNoteElement(id, color) {
    const el = document.getElementById(id);
    if (el) {
        el.style.backgroundColor = color;
        const content = el.querySelector('.note-content');
        if (content) {
            content.blur();
            el.blur();
        }
        return color;
    }
}