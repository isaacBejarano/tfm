using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tfm_users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Roles = table.Column<string[]>(type: "text[]", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Archived = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tfm_users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "tfm_users",
                columns: new[] { "Id", "Archived", "Created", "Email", "Name", "Password", "Roles", "Updated" },
                values: new object[,]
                {
                    { new Guid("0195e280-1000-7100-8000-000000000001"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 0, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Kalush@yopmail.com", "Kalush", "AQAAAAIAAYagAAAAEGwHgGIpRMXWQEvkORiPfV6rtNf3mgCqvdfJA115SNOSj+2r2qfzc+kjluWj3OytXw==", new[] { "User" }, null },
                    { new Guid("0195e280-1001-7100-8000-000000000002"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 5, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Dorofeeva@yopmail.com", "Dorofeeva", "AQAAAAIAAYagAAAAEHCYfGDeayZq/9Gi0gjYFQwNpMYM6+UJJw43Z6FwrBwJTnpcYcGS4q0hD0wNc4g9uA==", new[] { "User" }, null },
                    { new Guid("0195e280-1002-7100-8000-000000000003"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 10, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Kola@yopmail.com", "Kola", "AQAAAAIAAYagAAAAELtGwVxD76L9NvJBwWoBaHJ+6jPxX58iSqC0Yb1bJj7Kb7GiBgUz/EIaY/MtwNSN1Q==", new[] { "User" }, null },
                    { new Guid("0195e280-1003-7100-8000-000000000004"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 15, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Onuka@yopmail.com", "Onuka", "AQAAAAIAAYagAAAAEJ+PnhCcxUVxFzAy8scD19KDucHiGgpHf2uSK1rw/SfXYPefcJO0yH39hhRWVDiNKw==", new[] { "User" }, null },
                    { new Guid("0195e280-1004-7100-8000-000000000005"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 20, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Parfeniuk@yopmail.com", "Parfeniuk", "AQAAAAIAAYagAAAAEB5nPeoMDxsQpa2lLQn/61jmKZe4XbsI9W01NeoCRHx69UERvu/Dc5B7fVDxXUqn8w==", new[] { "User" }, null },
                    { new Guid("0195e280-1005-7100-8000-000000000007"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 30, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Tribunal@yopmail.com", "Tribunal", "AQAAAAIAAYagAAAAEHsuE/FMumGyWhg0+txuAkz6gTXKnbgkSOmuCc+rnr3VTdjastEqgvs1Srr+8I3Jiw==", new[] { "Admin" }, null },
                    { new Guid("0195e280-1005-7100-8000-000000000008"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 35, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Super@yopmail.com", "Super admin", "AQAAAAIAAYagAAAAEEdbb8s8Cha+UGEo6NaggLw+/jVUtJHJf/HaZDhdYAVFCecKG/qnEiJPvzmxf0RnWA==", new[] { "Super" }, null },
                    { new Guid("0195e280-1006-7100-8000-000000000006"), null, new DateTimeOffset(new DateTime(2026, 6, 6, 12, 0, 25, 150, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Anonymous@yopmail.com", null, "AQAAAAIAAYagAAAAEPvNNRBeFpA9snhyBGCdYEZ3/EqHvrCUMawAIzfHxoDMDl5HA7TC+JL8wyTIxFMSEA==", new[] { "User" }, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_tfm_users_Email",
                table: "tfm_users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tfm_users");
        }
    }
}
