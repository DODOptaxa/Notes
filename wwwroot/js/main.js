document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('noteContainer');

    getNotes().then(notes => displayNotes(notes, container));

    container.addEventListener('click', async (e) => {
        if (e.target === container || e.target.tagName === 'H1') {
            const containerRect = container.getBoundingClientRect();
            let x = e.clientX - containerRect.left - 100;
            let y = e.clientY - containerRect.top - 50;

            const maxX = container.clientWidth - 300;
            const maxY = container.clientHeight - 100;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            const note = await createNote({ content: '', x, y, color: '#ffffff' });
            if (note) {
                const noteEl = createNoteElement(note);
                container.appendChild(noteEl);
                clampNoteWithinContainer(noteEl, container);
                await updateNote(note.id, noteEl.querySelector('.note-content').value, x, y, note.color);
            }
        }
    });
});

async function deleteNoteObject(id) {
    await deleteNote(id);
    deleteNoteElement(id);
}

async function updateNoteObject(id, content, x, y, color) {
    if (color) {
        updateNoteElement(id, color);
    }
    await updateNote(id, content, x, y, color);
}

function clampNoteWithinContainer(note, container) {
    let x = note.offsetLeft;
    let y = note.offsetTop;

    if (x + note.offsetWidth > container.offsetWidth) {
        x = container.offsetWidth - note.offsetWidth;
    }
    if (x < 0) x = 0;

    if (y + note.offsetHeight > container.offsetHeight) {
        y = container.offsetHeight - note.offsetHeight;
    }
    if (y < 0) y = 0;

    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
}