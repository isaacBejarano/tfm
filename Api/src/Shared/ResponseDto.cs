namespace Api.Dto;

public record ResponseDto<T>(
  T[] Items,
  string Msg
) {
  public int Count => Items.Length;
}
