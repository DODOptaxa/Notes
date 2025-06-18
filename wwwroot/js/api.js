const apiUrl = 'api/notes/';

async function getNotes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Помилка завантаження заміток');
        return await response.json();
    } catch (error) {
        console.error('Помилка:', error);
        return [];
    }
}

async function createNote(note) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Помилка при додаванні замітки');
        return await response.json();
    } catch (error) {
        console.error('Помилка:', error);
        return null;
    }
}

async function updateNote(id, content, x, y) {
    console.log(content)
	try {
		const response = await fetch(`${apiUrl}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, content, x, y }),
		})
		if (!response.ok) throw new Error('Помилка при оновленні замітки')

	} catch (error) {
		console.error('Помилка:', error)
	}
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Помилка при видаленні замітки');
        return true;
    } catch (error) {
        console.error('Помилка:', error);
        return false;
    }
}
