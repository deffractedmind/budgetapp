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

  $("#budget, #budgetPriceDisplay, #stockOptions, #displayText, #checkOut, #navigation, #investmentSection").hide();

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
      $("#budgetPriceDisplay, #stockOptions, #displayText, #checkOut").show();
    });

    var queryURL = "assets/javascript/dow.json"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(event) {
      var data = event.stocks;

      var stockPrice = 100; //this is a default value
      var number = 0; //this is a default value

      for (var i = 0; i < data.length; i++) {
        var htmlStuff = "<div class='row stock' data-symbol=" + data[i].symbol + ">" +
          "<div class='col-md-2'>" +
          "<img src=" + data[i].image + " class='logos' alt='stock-image'>" +
          "</div>" +
          " <div class='col-md-4'>" +
          "<h4 class='stockName'>" + data[i].name + "</h4>" +
          "</div>" +
          "<div class='col-md-1'>" +
          "<h4 class='stockSymbol'>" + data[i].symbol + "</h4>" +
          "</div>" +
          "<div class='col-md-1'>" +
          "<h4 class='stockPrice'>" + "$" + stockPrice + "</h4>" +
          "</div>" +
          "<div class='col-md-4'>" +
          "<div class='row'>" +
          "<div class='col-md-4'>" +
          "<button id='minusQuantity' type='button' name='button'><h4>-</h4></button>" +
          "</div>" +
          "<div class='col-md-4'>" +
          "<h4 id='" + data[i].symbol + "quantity'>" + number + "</h4>" +
          "</div>" +
          "<div class='col-md-4'>" +
          "<button id='addQuantity' type='button' name='button'><h4>+</h4></button>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
        $("#stockOptions").prepend(htmlStuff);
      }

      $(document).on('click', '#minusQuantity, #addQuantity', function() {
        var parent = $(this).closest(".stock").data("symbol");
        if ($(this).attr("id") === "minusQuantity") {
          number--;
          $("#" + parent + "quantity").text(number);
        } else if ($(this).attr("id") === "addQuantity") {
          number++;
          $("#" + parent + "quantity").text(number);
        }
      });
      $("#checkOut").on('click', function() {
        $("#investmentSection").show();
        $("#budgetPriceDisplay, #stockOptions, #displayText, #checkOut").hide();
        for (var i = 0; i < data.length; i++) {
          if ($("#" + data[i].symbol + "quantity").text() > 0) {
            var tableRow = $("<tr>");
            var tableData =
              "<td>" + data[i].name + "</td>" +
              "<td>" + "</td>" +
              "<td>" + "</td>" +
              "<td>" + $("#" + data[i].symbol + "quantity").text() + "</td>" +
              "<td>" + "</td>" +
              "<td>" + "</td>" +
              "<td>" + "</td>";

            tableRow.append(tableData);
            $("tbody").append(tableRow);
            console.log(data[i].name);
          }
        }
      })
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
