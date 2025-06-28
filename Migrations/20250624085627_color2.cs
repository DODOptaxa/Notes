using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoteBoardApi.Migrations
{
    /// <inheritdoc />
    public partial class color2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Color",
                table: "Notes",
                newName: "HexColor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HexColor",
                table: "Notes",
                newName: "Color");
        }
    }
}
