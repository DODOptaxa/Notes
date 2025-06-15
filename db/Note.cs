using System;
using System.ComponentModel.DataAnnotations;

namespace NoteBoardApi.db
{
    public class Note
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public double X { get; set; } // Координата X на екрані

        [Required]
        public double Y { get; set; } // Координата Y на екрані

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}