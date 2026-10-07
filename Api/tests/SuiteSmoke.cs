namespace Api.Tests;

public class SuiteSmoke
{
  [Fact]
  public void True_is_true()
  {
    var smokeSum1 = false && false;
    var smokeSum2 = false && true;
    var smokeSum3 = true && true;
    var smokeSum4 = false || true;
    Assert.False(smokeSum1);
    Assert.False(smokeSum2);
    Assert.True(smokeSum3);
    Assert.True(smokeSum4);
  }

  [Fact]
  public void Smoke_sum()
  {
    var _precission = 1;
    Assert.Equal(2.125 + 2, 4.1, _precission);
  }
}
