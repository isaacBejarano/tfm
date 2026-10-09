using Api.Shared;

namespace Api.Tests.Shared;

public class DtoIdSpec : IDisposable {
  // ~before each (ctor)
  // public DtoIdSpec() { }

  // ~tear down
  public void Dispose() { }

  private static readonly Guid _idEmpty = Guid.Empty;
  private static readonly Guid _idNew = Guid.NewGuid();

  [Theory]
  [InlineData("00000000-0000-0000-0000-000000000000")]
  [InlineData("8f3c129e-4b71-4a9f-9273-e4d6a8b3c102")]
  public void DtoId_Id_IS_Guid_empty_or_new(Guid id) {
    Assert.IsType<DtoId>(new DtoId(id));
    Assert.IsType<DtoId>(new DtoId(_idEmpty));
    Assert.IsType<DtoId>(new DtoId(_idNew));
  }

  [Fact]
  public void DtoId_ISNOT_anonyous_object() {
    Assert.IsNotType<DtoId>(new { Id = _idEmpty });
    Assert.IsNotType<DtoId>(new { Id = _idNew });
  }
}
