using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NoteBoardApi.db;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NoteBoardApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly ILogger<NotesController> _logger;
        private readonly NoteDbContext _context;

        public NotesController(NoteDbContext context, ILogger<NotesController> logger)
        {
            _context = context;
            _logger = logger;

        }

        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            try
            {
                var notes = await _context.Notes.ToListAsync();

                return Ok(notes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving notes.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] NoteCreateDto noteDto)
        {
            var note = new Note
            {
                Content = noteDto.Content,
                X = noteDto.X,
                Y = noteDto.Y,
                Color = noteDto.Color ?? "#ffffff"
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] NoteUpdateDto noteDto)
        {
            if (id != noteDto.Id)
            {
                return BadRequest("ID не співпадає.");
            }

            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            if (note.Content != noteDto.Content && noteDto.Content != null) 
            {
                note.Content = noteDto.Content;
            }
            if(note.X != noteDto.X && noteDto.X >= 0) note.X = noteDto.X;

            if(note.Y != noteDto.Y && noteDto.Y >= 0) note.Y = noteDto.Y;
            Console.WriteLine(noteDto.Color + " AAA__________");
            if (noteDto.Color != null && !noteDto.Color.IsNullOrEmpty() && noteDto.Color != "#ffffff")
            {
                Console.WriteLine(noteDto.Color);
                note.Color = noteDto.Color;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}