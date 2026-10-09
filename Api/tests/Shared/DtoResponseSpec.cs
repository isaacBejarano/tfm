using Api.Shared;

namespace Api.Tests.Shared;

public class DtoResponseSpec : IDisposable {
  // ~tear down
  public void Dispose() { }

  // ~before each (ctor)
  private static readonly DtoResponse<object> _DtoResponseEmpty = new([], "Response Empty Items");
  private static readonly DtoResponse<int> _DtoResponseFull = new([1, 2, 3], "Response With Items");

  [Fact]
  public void DtoResponse_Items_CANBE_arrayOf_empty_object() {
    Assert.IsType<DtoResponse<object>>(_DtoResponseEmpty);
    Assert.IsNotType<DtoResponse<object>>(_DtoResponseFull);
  }

  [Fact]
  public void DtoResponse_Count_IS_0_WHEN_Items_IS_arrayOf_empty_object() {
    Assert.True(_DtoResponseEmpty.Count == 0);
    Assert.True(_DtoResponseEmpty.Msg == "Response Empty Items");
  }

  [Fact]
  public void DtoResponse_Items_CANBE_arrayOf_typed_object() {
    Assert.IsType<DtoResponse<int>>(_DtoResponseFull);
    Assert.IsNotType<DtoResponse<int>>(_DtoResponseEmpty);
  }

  [Fact]
  public void DtoResponse_Count_MATCHES_Items_length_WHEN_arrayOf_typed_object() {
    Assert.True(_DtoResponseFull.Count == 3);
    Assert.True(_DtoResponseFull.Msg == "Response With Items");
  }

  [Fact]
  public void DtoResponse_WHEN_full_HAS_ALWAYS_members_typed() {
    Assert.Equal([1, 2, 3], _DtoResponseFull.Items);
    Assert.IsType<int[]>(_DtoResponseFull.Items);
    Assert.Equal(3, _DtoResponseFull.Count);
    Assert.IsType<int>(_DtoResponseFull.Count);
    Assert.Equal("Response With Items", _DtoResponseFull.Msg);
    Assert.IsType<string>(_DtoResponseFull.Msg);
  }

  [Fact]
  public void DtoResponse_WHEN_empty_HAS_ALWAYS_members_typed() {
    Assert.Equal([], _DtoResponseEmpty.Items);
    Assert.IsType<object[]>(_DtoResponseEmpty.Items);
    Assert.Equal(0, _DtoResponseEmpty.Count);
    Assert.IsType<int>(_DtoResponseEmpty.Count);
    Assert.Equal("Response Empty Items", _DtoResponseEmpty.Msg);
    Assert.IsType<string>(_DtoResponseEmpty.Msg);
  }

  [Fact]
  public void DtoResponse_WHEN_empty_HAS_NEVER_members_null() {
    Assert.NotNull(_DtoResponseEmpty.Items);
    Assert.NotNull(_DtoResponseEmpty.Msg);
  }

  [Theory]
  [InlineData("00000000-0000-0000-0000-000000000000")]
  [InlineData("8f3c129e-4b71-4a9f-9273-e4d6a8b3c102")]
  public void DtoResponse_OFTYPE_DtoId_HAS_members_typed(Guid id) {
    DtoId item = new DtoId(id);
    DtoResponse<DtoId> dto = new([item], "Response With Items oftype DtoId");

    Assert.NotNull(dto.Items);
    Assert.IsType<DtoId[]>(dto.Items);
    Assert.Equal([item], dto.Items);

    Assert.IsType<int>(dto.Count);
    Assert.Equal(1, dto.Count);

    Assert.NotNull(dto.Msg);
    Assert.IsType<string>(dto.Msg);
    Assert.Equal("Response With Items oftype DtoId", dto.Msg);
  }
}
