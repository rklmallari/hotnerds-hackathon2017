var auth = firebase.auth();
var database = firebase.database();

document.getElementById('adminMUAddUserBtn').addEventListener('click', addAdminUser, true);
var currEmail = document.getElementById('adminMUEmailField').value;

function addAdminUser() {
 
  	/*
	  	database.ref('admins/' + userId).set({
	  	  username: name,
	  	  email: email,
	  	  profile_picture : imageUrl
	  	});
	  	*/
	
	
	console.log("addAdminUser, " + currEmail);
	//getUIDfromEmail(email);

	database.ref('/users/').once('value').then(function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		currEmail = document.getElementById('adminMUEmailField').value;

		for (var key in snapshot.val())
		{
			console.log(arr[key].email);
			console.log(currEmail);
			if (arr[key].email == currEmail){
    			console.log("User to be converted to admin is found.");

    			// Add in admins node.
    			database.ref('admins/KSDLKFSJDFLKDSF').push({
	  				email: currEmail
	  			});

    			// Set adminFlag to true in users node.
    			database.ref('/users/' + key).once('value').then(function (snapshot) {
    				snapshot.ref.update({adminFlag: 'true'});
    				//arr[key].adminFlag = true;
    			});
    			break;
    		}
    	}
    });


}

function getUIDfromEmail(email) {
  var xhttp = new XMLHttpRequest();
  var targetUrl = "https://us-central1-fireboard-hackathon2017.cloudfunctions.net/getUIDByEmail?email=" + email;
  
  xhttp.onreadystatechange = function() {
    /*if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }else if (this.status){
		document.getElementById("demo").innerHTML = "Can not access: " + targetUrl 
			+ " <br /> Response: " + this.status + " " + this.responseText;
	}else{
		document.getElementById("demo").innerHTML = "Loading... ";
	}*/

	var uid = this.responseText;
	console.log(uid);
  };
  
  xhttp.open("GET", targetUrl, true);
  xhttp.send();
}