using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace NoteBoardApi.db
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public double X { get; set; }

        [Required]
        public double Y { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Author { get; set; } = string.Empty;

        private string _hexColor = "#FFFFFF";

        [MaxLength(7)]
        [RegularExpression("^#[0-9A-Fa-f]{6}$")]
        public string Color
        {
            get => _hexColor;
            set
            {
                if (!Regex.IsMatch(value, "^#(?:[0-9a-fA-F]{6})$"))
                    throw new ArgumentException("Invalid hex color format. Must be #RRGGBB.");
                _hexColor = value;
            }
        }
    }
}