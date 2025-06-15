document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('noteContainer');

    getNotes().then(notes => displayNotes(notes, container));

    container.addEventListener('click', async (e) => {
        if (e.target === container || e.target.tagName === 'H1') {
            const x = e.clientX - 100; 
            const y = e.clientY - 50;
            const note = await createNote({ content: '', x, y });
            if (note) {
                container.appendChild(createNoteElement(note));
            }
        }
    });
});

async function deleteNoteObject(id) {
    await deleteNote(id);
    deleteNoteElement(id);
    return;
}

async function updateNoteObject(id, content, х, y) {
	await updateNote(id, content, х, y);
    updateNoteElement(id);
	
}