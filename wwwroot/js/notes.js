let zIndexCounter = 1;
function createNoteElement(note) {
	const noteDiv = document.createElement('div')
	noteDiv.className = 'note'
	noteDiv.id = note.id
	noteDiv.style.left = `${note.x}px`
	noteDiv.style.top = `${note.y}px`
    noteDiv.style.zIndex = zIndexCounter++

    let isDragging = false
    let currentX = note.x || 0
    let currentY = note.y || 0
    let initialX, initialY

    noteDiv.addEventListener('mousedown', e => {
			if (
				e.target.classList.contains('note-content') ||
				e.target.classList.contains('delete-btn') ||
				e.target.classList.contains('save-btn')
			)
				return
			isDragging = true
			initialX = e.clientX - currentX
			initialY = e.clientY - currentY
			noteDiv.style.zIndex = zIndexCounter++
			noteDiv.classList.add('dragging')
			e.preventDefault()
		})

		document.addEventListener('mousemove', e => {
			if (isDragging) {
				currentX = Math.max(
					0,
					Math.min(e.clientX - initialX, window.innerWidth - noteDiv.offsetWidth
					)
				)
				currentY = Math.max(
					0,
					Math.min( e.clientY - initialY,window.innerHeight - noteDiv.offsetHeight
					)
				)
				noteDiv.style.left = `${currentX}px`
				noteDiv.style.top = `${currentY}px`
			}
		})

		document.addEventListener('mouseup', async () => {
			if (isDragging) {
				isDragging = false
				noteDiv.classList.remove('dragging')
				console.log(currentX)
				await updateNote(
					note.id,
					noteDiv.querySelector('.note-content').value,
					currentX,
					currentY
				)
			}
		})

	noteDiv.addEventListener('click', () => {
		noteDiv.style.zIndex = zIndexCounter++
	})
	noteDiv.innerHTML = `
    <div class="note-header">
        <button class="delete-btn" onclick="deleteNoteObject('${note.id}')">✕</button>
        <button class="save-btn" onclick="updateNoteObject('${note.id}', this.parentElement.nextElementSibling.value, ${note.x}, ${note.y})">✔</button>
    </div>
    <textarea class="note-content">${note.content}</textarea>
`
	return noteDiv
}

function displayNotes(notes, container) {
	container.querySelectorAll('.note').forEach(note => note.remove())
	notes.forEach(note => container.appendChild(createNoteElement(note)))
}

function deleteNoteElement(id) {
	const noteElement = document.getElementById(id)
	if (noteElement && noteElement.classList.contains('note')) {
		noteElement.remove()
	}
}

function updateNoteElement(id){
	const noteElement = document.getElementById(id)
	console.log(1);
	if (noteElement && noteElement.classList.contains('note')) {
		const content = noteElement.querySelector('.note-content');
		if(content){
			console.log(2);
			content.blur();
			noteElement.blur();
		}
		
	}
}
