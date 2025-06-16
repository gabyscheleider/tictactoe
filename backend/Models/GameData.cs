using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class GameData
    {
        public Dictionary<string, string> Marks { get; set; } = new();
        public string? Winner { get; set; }
        public bool Draw { get; set; }

        [Key]
        public int Id { get; set; }

        public string MarksJson { get; set; } = string.Empty;
    }
}
