using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                var userInfo = new
                {
                    RemoteIpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = HttpContext.Request.Headers["User-Agent"].ToString()
                };

                _logger.LogInformation(
                    "GetNotes request received. IP: {RemoteIpAddress}, Browser: {UserAgent}",
                    userInfo.RemoteIpAddress,
                    userInfo.UserAgent
                );

                var notes = await _context.Notes.ToListAsync();

                return Ok(notes);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error in GetNotes. IP: {RemoteIpAddress}, Browser: {UserAgent}",
                    HttpContext.Connection.RemoteIpAddress?.ToString(),
                    HttpContext.Request.Headers["User-Agent"].ToString()
                );

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
                Y = noteDto.Y
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNote(string id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(string id, [FromBody] NoteUpdateDto noteDto)
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

            note.Content = noteDto.Content;
            note.X = noteDto.X;
            note.Y = noteDto.Y;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(string id)
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