namespace Api.Shared;

public record ResponseDto<T>(
  T[] Items,
  string Msg
) {
  public int Count => Items.Length;
}
