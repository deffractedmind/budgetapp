var stocks = "GE, CSCO, PFE, INTC, KO, VZ, NKE, MRK, MSFT, WMT, AXP, XOM, DD, JPM, PG, V, CAT, DIS, CVX, UTX, TRV, JNJ, AAPL, MCD, HD, IBM, UNH, BA, MMM, GS".split(', ');

for (var i = 0; i < 5; i++) {
  var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + stocks[i] + ".json?api_key=VuuvNaPTN5MnByv3mtxS&";

  //
  $.ajax({
    url: queryURL,
    crossDomain: true,
    dataType: "JSON",
    jsonpCallback: "callback",
    method: "GET"
  }).done(function(response) {
      console.log(response);
  });
}
