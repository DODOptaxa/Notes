namespace NoteBoardApi.db
{
    public class NoteCreateDto
    {
        public string Content { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class NoteUpdateDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
    }
}