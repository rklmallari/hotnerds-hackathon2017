'use strict';

function fireBoards() {
  this.checkSetup();

  this.signInLink = document.getElementById('signIn');
  this.signOutLink = document.getElementById('signOut');
  this.signInList = document.getElementById('signInList');
  this.signOutList = document.getElementById('signOutList');

  this.homeLink = document.getElementById('home');
  this.homePage = document.getElementById('homePage');
  this.aboutLink = document.getElementById('about');
  this.aboutPage = document.getElementById('aboutPage');
  this.coursesLink = document.getElementById('courses');
  this.coursesPage = document.getElementById('coursesPage');
  this.manageLink = document.getElementById('manageFireboards');
  this.managePage = document.getElementById('managePage');
  this.reportsLink = document.getElementById('reports');
  this.reportsPage = document.getElementById('reportsPage');
  this.announcementsLink = document.getElementById('announcements');
  this.announcementsPage = document.getElementById('announcementsPage');
  this.profileLink = document.getElementById('myProfile');
  this.profilePage = document.getElementById('profilePage');
  this.myFBLink = document.getElementById('myFireboards');
  this.myFBPage = document.getElementById('myFBPage');

  this.homeLink.addEventListener('click', this.homeShow.bind(this));
  this.aboutLink.addEventListener('click', this.aboutShow.bind(this));
  this.coursesLink.addEventListener('click', this.coursesShow.bind(this));
  this.manageLink.addEventListener('click', this.manageShow.bind(this));
  this.reportsLink.addEventListener('click', this.reportsShow.bind(this));
  this.announcementsLink.addEventListener('click', this.announcementsShow.bind(this));
  this.profileLink.addEventListener('click', this.profileShow.bind(this));
  this.myFBLink.addEventListener('click', this.myFBShow.bind(this));

  // 
	
  this.adminMUAddUserBtn = document.getElementById('adminMUAddUserBtn');
  this.adminMUAddUserBtn.addEventListener('click', this.addAdminUser.bind(this));
  this.readyStateCounter = 0;

  this.signOutList.addEventListener('click', this.signOut.bind(this));
  this.signInList.addEventListener('click', this.signIn.bind(this));
  this.initFirebase();
}

fireBoards.prototype.signIn = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'prompt': 'select_account'
  });
  const promise = this.auth.signInWithPopup(provider);
  console.info("User logged in.");
  promise.catch(e => console.log(e.message));
}

fireBoards.prototype.initFirebase = function () {
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
}

fireBoards.prototype.signOut = function () {
  this.auth.signOut();
  console.info("User logged out.");
}

fireBoards.prototype.onAuthStateChanged = function(user) {
  if (user) { 
    
    this.signInList.setAttribute('class', 'hide');
    this.signOutList.removeAttribute('class');
    this.coursesLink.removeAttribute('class');
  	this.myFBLink.removeAttribute('class');
  	this.manageLink.removeAttribute('class');
  	this.reportsLink.removeAttribute('class');
  	this.profileLink.removeAttribute('class');
    //this.checkUserExist(user);

  } else {
   	
    this.signInList.removeAttribute('class');
    this.signOutList.setAttribute('class', 'hide');
    this.coursesLink.setAttribute('class', 'hide');
  	this.myFBLink.setAttribute('class', 'hide');
  	this.manageLink.setAttribute('class', 'hide');
  	this.reportsLink.setAttribute('class', 'hide');
  	this.profileLink.setAttribute('class', 'hide');
  }
};

fireBoards.prototype.checkUserExist = function (user) {
  var userRef = this.database.ref('users/' + user.uid);
  userRef.once('value', function(snapshot) {
    if (snapshot.val() == null) {
      userRef.set({
        userName : user.displayName
      });
      console.log("User inserted on DB.");
    } else {
      userRef.update({
        userName : user.displayName
      });
      console.log("User updated on DB.");
    }
  });
};

fireBoards.prototype.addAdminUser = function () {
 
  	/*
	  	database.ref('admins/' + userId).set({
	  	  username: name,
	  	  email: email,
	  	  profile_picture : imageUrl
	  	});
	  	*/
    var currEmail = document.getElementById('adminMUEmailField').value;
    this.readyStateCounter = 0;
	console.log("addAdminUser, " + currEmail);
	//this.getUIDfromEmail(currEmail);

	firebase.database().ref('/users/').once('value').then(function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		//currEmail = document.getElementById('adminMUEmailField').value;

		for (var key in snapshot.val())
		{
			console.log(arr[key].email);
			console.log("Current Email: " + currEmail);
			if (arr[key].email == currEmail){
    			console.log("User to be converted to admin is found.");

    			fireBoards.getUIDfromEmail(currEmail);

    			// Set adminFlag to true in users node.
    			firebase.database().ref('/users/' + key).once('value').then(function (snapshot) {
    				snapshot.ref.update({adminFlag: 'true'});
    				//arr[key].adminFlag = true;
    			});
    			break;
    		}
    	}
    });


};

/*
fireBoards.prototype.getUIDfromEmailPromise = function (email) {
    return new Promise(resolve => {
        getUIDfromEmail(email, resolve);
    });
}*/

fireBoards.prototype.getUIDfromEmail = function(email) {
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
		if (this.status == 200) {
			var uid = this.responseText;
			console.log(uid);
    	}
  };
  
  xhttp.open("GET", targetUrl, true);
  xhttp.send();
};

fireBoards.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

fireBoards.prototype.homeShow = function() {
	this.homePage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');

		if(this.auth.currentUser) {
			this.reportsPage.setAttribute('hidden', true);
			this.reportsLink.removeAttribute('class');
			this.profilePage.setAttribute('hidden', true);
			this.profileLink.removeAttribute('class');
			this.managePage.setAttribute('hidden', true);
			this.manageLink.removeAttribute('class');
			this.myFBPage.setAttribute('hidden', true);
			this.myFBLink.removeAttribute('class');
			this.coursesPage.setAttribute('hidden', true);
			this.coursesLink.removeAttribute('class');
		}
}

fireBoards.prototype.aboutShow = function() {
	this.aboutPage.removeAttribute('hidden');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');

		if(this.auth.currentUser) {
			this.reportsPage.setAttribute('hidden', true);
			this.reportsLink.removeAttribute('class');
			this.profilePage.setAttribute('hidden', true);
			this.profileLink.removeAttribute('class');
			this.managePage.setAttribute('hidden', true);
			this.manageLink.removeAttribute('class');
			this.myFBPage.setAttribute('hidden', true);
			this.myFBLink.removeAttribute('class');
			this.coursesPage.setAttribute('hidden', true);
			this.coursesLink.removeAttribute('class');
		}
}

fireBoards.prototype.coursesShow = function() {
	this.coursesPage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
			this.reportsPage.setAttribute('hidden', true);
			this.reportsLink.removeAttribute('class');
			this.profilePage.setAttribute('hidden', true);
			this.profileLink.removeAttribute('class');
			this.managePage.setAttribute('hidden', true);
			this.manageLink.removeAttribute('class');
			this.myFBPage.setAttribute('hidden', true);
			this.myFBLink.removeAttribute('class');
			this.homePage.setAttribute('hidden', true);
			this.homeLink.removeAttribute('class');
}

fireBoards.prototype.manageShow = function() {
	this.managePage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.reportsPage.setAttribute('hidden', true);
		this.reportsLink.removeAttribute('class');
		this.profilePage.setAttribute('hidden', true);
		this.profileLink.removeAttribute('class');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');
		this.myFBPage.setAttribute('hidden', true);
		this.myFBLink.removeAttribute('class');
		this.coursesPage.setAttribute('hidden', true);
		this.coursesLink.removeAttribute('class');
}

fireBoards.prototype.reportsShow = function() {
	this.reportsPage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');
		this.profilePage.setAttribute('hidden', true);
		this.profileLink.removeAttribute('class');
		this.managePage.setAttribute('hidden', true);
		this.manageLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
		this.myFBPage.setAttribute('hidden', true);
		this.myFBLink.removeAttribute('class');
		this.coursesPage.setAttribute('hidden', true);
		this.coursesLink.removeAttribute('class');
}

fireBoards.prototype.announcementsShow = function() {
	this.announcementsPage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');

		if (this.auth.currentUser) {
			this.reportsPage.setAttribute('hidden', true);
			this.reportsLink.removeAttribute('class');
			this.profilePage.setAttribute('hidden', true);
			this.profileLink.removeAttribute('class');
			this.managePage.setAttribute('hidden', true);
			this.manageLink.removeAttribute('class');
			this.myFBPage.setAttribute('hidden', true);
			this.myFBLink.removeAttribute('class');
			this.coursesPage.setAttribute('hidden', true);
			this.coursesLink.removeAttribute('class');
		}
}

fireBoards.prototype.profileShow = function() {
	this.profilePage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.reportsPage.setAttribute('hidden', true);
		this.reportsLink.removeAttribute('class');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');
		this.managePage.setAttribute('hidden', true);
		this.manageLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
		this.myFBPage.setAttribute('hidden', true);
		this.myFBLink.removeAttribute('class');
		this.coursesPage.setAttribute('hidden', true);
		this.coursesLink.removeAttribute('class');
}

fireBoards.prototype.myFBShow = function() {
	this.myFBPage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.reportsPage.setAttribute('hidden', true);
		this.reportsLink.removeAttribute('class');
		this.profilePage.setAttribute('hidden', true);
		this.profileLink.removeAttribute('class');
		this.managePage.setAttribute('hidden', true);
		this.manageLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
		this.homePage.setAttribute('hidden', true);
		this.homeLink.removeAttribute('class');
		this.coursesPage.setAttribute('hidden', true);
		this.coursesLink.removeAttribute('class');
}

fireBoards.prototype.upload = function (e) {
  e.preventDefault();

  	var reqFields = "";
  	if(category.value === "" || category.value === null) {
  		reqFields += "Category";
  	}
  	if(courseDescription.value === "" || courseDescription.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Description";
  		} else {
  			reqFields += "Course Description";
  		}
  	}
  	if(courseName.value === "" || courseName.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Name";
  		} else {
  			reqFields += "Course Name";
  		}
  	}
  	if(courseType.value === "" || courseType.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Type";
  		} else {
  			reqFields += "Course Type";
  		}

  		if (courseType !== "File" && (courseURL === null || courseURL === "")) {
  			if (reqFields !== "") {
  				reqFields += ", Course URL";
	  		} else {
	  			reqFields += "Course URL";
	  		}
  		}
  	}

  	if(reqFields !== "") {
      alert("Please populate below required field(s): \n" + reqFields);
    } else {

    	if (category.value === "File") {
    		  var file = e.target.files[0];
		      var metadata = {
		          'contentType': file.type
		      };
		      var storageRef = this.storage.ref('fireboards/' + category.value + "/" + firebase.auth().currentUser.uid + '_' + bookTitle.value);

		      //var storageRef = this.storage.ref('projects/projectName/assets/assetName/original/')

		      var task = storageRef.put(file, metadata);

		      task.on('state_changed', 

		        function(snapshot) {
		          var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
		          uploader.value = percentage;
		          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
		        },
		        function(error) {
		          console.error('Upload failed:', error);
		          alert('Upload failed! Ensure that you are uploading a file with acceptable format.')
		        },
		        function() {
		            this.downloadURL = task.snapshot.downloadURL;

					var postData = {
					    category: category.value,
					    courseBannerURL: 'assets/images/DefaultFileBanner.png',
					    courseDescription: courseDescription.value,
					    courseName: courseName.value,
					    courseType: courseType.value,
					    courseURL: downloadURL,
					    overallRating: 0,
					    popularity: 0,
					    uploadDate: Date.now(),
					    uploadedBy: auth.currentUser.email
					};

		            var coursesRef = this.database.ref('fireCourses').push(postData);

  		        }
		      );
    	} else {
    		var postData = {
			    category: category.value,
			    courseBannerURL: 'assets/images/DefaultVideoBanner.png',
			    courseDescription: courseDescription.value,
			    courseName: courseName.value,
			    courseType: courseType.value,
			    courseURL: courseURL.value,
			    overallRating: 0,
			    popularity: 0,
			    uploadDate: Date.now(),
			    uploadedBy: auth.currentUser.email
			};
            var coursesRef = this.database.ref('fireCourses').push(postData, snap => {
            	alert('New course added!');
            },error =>{
            	alert('Error on adding new course. Please try again.');
            });
    	}
    }
}

fireBoards.prototype.updateUser = function(user) {
  	if(this.value !== null && this.bio.value !== "") {
	    var updateUserPost = {
	      bio : bio.value
	    };
	    var userRef = this.database.ref('users/' + user.uid);
	    userRef.update(updateUserPost);
	    console.log("User bio updated on DB.");
	    alert("Profile updated!");
	}
}

fireBoards.prototype.listAdminUsers = function () {

	console.log("listAdminusers");

	firebase.database().ref('/admins/').once('value').then(function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		//currEmail = document.getElementById('adminMUEmailField').value;

		for (var key in snapshot.val())
		{
			console.log(arr[key].email);
			$('<p>').text(arr[key].email).appendTo($('#listOfAdminUsers'));
    	}
    });

}

window.onload = function() {
  window.fireBoards = new fireBoards();

  fireBoards.listAdminUsers();
};