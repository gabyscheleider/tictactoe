using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTest()
        {
            return Ok("API está funcionando 🎉");
        }

        [HttpPost]
        public IActionResult PostGameData([FromBody] GameData data)
        {
            // Apenas exibe no console por enquanto
            Console.WriteLine("Jogo recebido:");
            Console.WriteLine($"Vencedor: {data.Winner}");
            Console.WriteLine($"Empate: {data.Draw}");
            Console.WriteLine("Marcações:");
            foreach (var mark in data.Marks)
            {
                Console.WriteLine($"Posição {mark.Key}: {mark.Value}");
            }

            return Ok(new { message = "Jogo salvo com sucesso!" });
        }
    }
}
