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
  
  var purchasePrice;
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();
  
  var database = firebase.database();

  firebase.auth().onAuthStateChanged(function(user) {
    $("#enterBudget, #budgetPriceDisplay, #stockOptions, #displayText, #checkoutFooter, #navigation, #investmentSection").hide();
    if (user) {
      $("#navigation").show();
      $("#login").hide();
      checkState();
      loggedIn();
      maintainUserDetails();
      console.log("logged in");
    } else {
      notLoggedIn();
    }
  });

  function maintainUserDetails() {
    $('#pic').attr("src", localStorage.picture);
    $('#userName').text(localStorage.name);
  }

  function notLoggedIn() {
    $("#loginButton").on('click', function() {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        name = user.displayName;
        email = user.email;
        photo = user.photoURL;
        uid = user.uid;
        console.log(photo);
        $('#pic').attr("src", user.photoURL);
        $('#userName').text(user.displayName);
        localStorage.setItem("name", user.displayName);
        localStorage.setItem("picture", user.photoURL);
        localStorage.setItem("guid", user.uid);
        // NOTE: Stan checks for user in database
        //if user exists in database, localStorage.state = holdings-screen
        //else
        localStorage.setItem("state", "budget-screen");
        checkState();
        console.log("logged in");
        // ...
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    });
  }

  function checkState() {
    if (localStorage.state === "budget-screen") {
      $("#enterBudget, #navigation").show();
      $("#login").hide();
    } else if (localStorage.state === "buy-stock-screen") {
      $("#chosenBudget").text(localStorage.budget);
      $("#enterBudget, #checkoutFooter").hide();
      $("#budgetPriceDisplay, #stockOptions, #displayText").show();
    } else if (localStorage.state === "confirm-stock-screen") {
      $("#checkoutFooter").show();
      $("#budgetPriceDisplay, #stockOptions, #displayText").hide();
    } else if (localStorage.state === "holdings-screen") {
      $("#investmentSection").show();
      $("#checkoutFooter").hide();
      //NOTE: Stan's data viz logic goes here
      //NOTE: We need to integrate the new york times API as well over here
    }
  }

  function loggedIn() {
    $("#budgetButton").on('click', function() {
      localStorage.setItem("budget", $("#userBudget").val());
      database.ref('user/'+localStorage.guid).child('account').set({
      'budget':localStorage.budget,
      'balance':localStorage.budget
      });
      localStorage.setItem("state", "buy-stock-screen");
      checkState();
      // we might need to push the budget here so the comparion works
    });

    database.ref('user/'+localStorage.guid).child('profile').set({
    'name':localStorage.name,
    'photoURL':localStorage.picture
    });

    var queryURL = "assets/javascript/dow.json"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(event) {
      var data = event.stocks;

      var stockPrice = 100; //this is a default value

      for (var i = 0; i < data.length; i++) {
        // NOTE: Adrianne's budget price/stock price comparison
        //if logic for if the budget price > stock price
        //if it is, run the below code, else skip.

        var otherHtmlStuff = "<div class='row stock' data-symbol=" + data[i].symbol + ">" +
          "<div class='col-md-2'>" +
          "<img src=" + data[i].image + " class='logos' alt='stock-image'>" +
          "</div>" +
          "<div class='col-md-8'>" +
          "<h4 class='stockName'>" + data[i].name + " (" + data[i].symbol + ")</h4>" +
          "<p>Price of stock 2 weeks ago: <span id=" + data[i].symbol + "-week  class='twoWeeks'></span></p>" +
          "<p>Price of stock 2 months ago: <span id=" + data[i].symbol + "-month class='twoMonths'></span></p>" +
          "<p>Price of stock 2 years ago: <span id=" + data[i].symbol + "-year class='twoYears'></span></p>" +
          "</div>" +
          "<div class='col-md-2'>" +
          //we'd enter the stock price here below
          "<h2 class='stockPrice'>" + "$" + stockPrice + "</h2>" +
          "<button class='buy' type='button' name='button'><h3>Buy</h3></button>" +
          "</div>" +
          "</div>";

        $("#stockOptions").prepend(otherHtmlStuff);
      }

      $(".buy").on('click', function() {
        //NOTE: We also need to check what the budget/stock price is so that we know
        //the quantity of stock and the remainder
        localStorage.setItem("state", "confirm-stock-screen");
        checkState();
        var stockBought = $(this).closest(".stock").data("symbol");
        var stockName = $(this).closest(".stock").find(".stockName").text();
        // we could store the quantity value here
        var quantity = 4;
        $("#stockName").text(stockName);
        // remaining change will be entered here in the text slot (instead of 12)
        $("#remainingChange").text('12');
        console.log(stockName);
        $("#userBuy").html("<h3>You bought " + quantity + " stocks of " + stockName + "</h3>");
        console.log(stockBought);
      });
      $(document).on("click", "#confirm, #cancel", function() {
        if ($(this).attr("id") === "confirm") {
          localStorage.setItem("state", "holdings-screen");
          //NOTE: Al's code - once the stock is bought, we push the date,
          //price, stock, quantity, balance, budget, etc
        } else if ($(this).attr("id") === "cancel") {
          localStorage.setItem("state", "buy-stock-screen");
        }
        checkState();
      });
      $("#sell").on("click", function() {
        // NOTE: Adrianne - When the user clicks sell, we add the returns to the balance/remainder
        // to get the new budget
        $("#investmentSection").hide();
        $("#budgetPriceDisplay, #stockOptions, #displayText").show();
        localStorage.setItem("state", "buy-stock-screen");
        checkState();
      });
      //button effects
      $(document).on("mousedown", "button, .buy", function() {
        $(this).css({
          'top': '5px',
          'left': '5px',
          'box-shadow': 'none'
        });
      });
      $(document).on("mouseup", "button, .buy", function() {
        $(this).css({
          'top': '0px',
          'left': '0px',
          'box-shadow': ' 5px 5px 0px #189699'
        });
      });
    });
  }

  $("#logOut").on('click', function() {
    localStorage.removeItem("state");
    localStorage.removeItem("name");
    localStorage.removeItem("picture");
    localStorage.removeItem("budget");

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
