namespace Api.Shared;

public record DtoResponse<T>(
  T[] Items,
  string Msg
) {
  public int Count => Items.Length;
}
