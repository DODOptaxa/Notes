using Microsoft.EntityFrameworkCore;

namespace NoteBoardApi.db
{
    public class NoteDbContext : DbContext
    {
        public DbSet<Note> Notes { get; set; }

        public NoteDbContext(DbContextOptions<NoteDbContext> options)
            : base(options)
        {
        }
    }
}