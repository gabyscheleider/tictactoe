using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GameController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostGameData([FromBody] GameDataDTO data)
        {
            var game = new GameData
            {
                Winner = data.Winner,
                Draw = data.Draw,
                MarksJson = JsonSerializer.Serialize(data.Marks)
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Jogo salvo com sucesso no banco!" });
        }

        [HttpGet("all")]
        public IActionResult GetAllGames()
        {
            var games = _context.Games.ToList();
            return Ok(games);
        }

    }

    // DTO separado para receber do React
    public class GameDataDTO
    {
        public string? Winner { get; set; }
        public bool Draw { get; set; }
        public Dictionary<string, string> Marks { get; set; } = new();
    }
}
