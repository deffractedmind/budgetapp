$(document).ready(function() {
  //fire base stuff--
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD0OYNbm34rfCoN1UnggDuQfNnr8ahcVs0",
    authDomain: "budgetapp-857ba.firebaseapp.com",
    databaseURL: "https://budgetapp-857ba.firebaseio.com",
    projectId: "budgetapp-857ba",
    storageBucket: "budgetapp-857ba.appspot.com",
    messagingSenderId: "93264138315"
  };
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();

  $("#budget, #budgetPriceDisplay, #stockOptions, #displayText, #checkoutFooter, #navigation, #investmentSection").hide();

  $("#loginButton").on('click', function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      user = result.user;
      console.log(user.displayName);
      console.log(user.email);
      console.log(user.photoURL);
      console.log(user.uid);
      $("#budget, #navigation").show();
      $("#login").hide();

      $('#pic').attr("src", user.photoURL);
      $('#userName').text(user.displayName);
      loggedIn();
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  });

  function loggedIn() {
    $("#budgetButton").on('click', function() {
      $("#budget").hide();
      var budget = $("#userBudget").val();
      $("#chosenBudget").text(budget);
      $("#budgetPriceDisplay, #stockOptions, #displayText").show();
    });

    var queryURL = "assets/javascript/dow.json"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(event) {
      var data = event.stocks;

      var stockPrice = 100; //this is a default value
      // var number = 0; //this is a default value

      for (var i = 0; i < data.length; i++) {
        var htmlStuff = "<div class='row stock' data-symbol=" + data[i].symbol + ">" +
          "<div class='col-md-2'>" +
          "<img src=" + data[i].image + " class='logos' alt='stock-image'>" +
          "</div>" +
          " <div class='col-md-6'>" +
          "<h4 class='stockName'>" + data[i].name +" ("+ data[i].symbol+")</h4>" +
          "</div>" +
          "<div class='col-md-4'>" +
          "<h2 class='stockPrice'>" + "$" + stockPrice + "</h2>" +
          "<button class='buy' type='button' name='button'><h3>Buy</h3></button>" +
          "</div>" +
          "</div>"
        $("#stockOptions").prepend(htmlStuff);
      }

      $(".buy").on('click', function() {
        $("#checkoutFooter").show();
        $("#budgetPriceDisplay, #stockOptions, #displayText").hide();
        var stockBought = $(this).closest(".stock").data("symbol");
        var stockName = $(this).closest(".stock").find(".stockName").text();
        var quantity = 4;
        $("#stockName").text(stockName);
        console.log(stockName);
        $("#investmentSection").html("<h3>You bought "+quantity+" "+ stockName +" stocks</h3>");
        console.log(stockBought);
      })
    });
    $(document).on("click","#confirm, #re-buy", function(){
      $("#checkoutFooter").hide();
      if($(this).attr("id") === "confirm"){
        $("#investmentSection").show();
      }
      else if($(this).attr("id") === "re-buy"){
        $("#checkoutFooter").hide();
        $("#budgetPriceDisplay, #stockOptions, #displayText").show();
      }
    });
  }
  $("#logOut").on('click', function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("You've signed out");
      $("#budget, #budgetPriceDisplay, #stockOptions, #displayText, #checkOut, #navigation, #investmentSection").hide();
      $("#login").show();
      location.reload();
    }).catch(function(error) {
      // An error happened.
    });
  });


})
