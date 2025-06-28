using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoteBoardApi.Migrations
{
    /// <inheritdoc />
    public partial class colors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Notes",
                type: "nvarchar(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Notes");
        }
    }
}
