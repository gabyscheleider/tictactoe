namespace backend.Models
{
    public class GameData
    {
        public Dictionary<string, string> Marks { get; set; } = new();
        public string? Winner { get; set; }
        public bool Draw { get; set; }
    }
}
