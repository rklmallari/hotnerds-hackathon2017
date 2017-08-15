'use strict';

function fireBoards() {
  this.checkSetup();

  this.signInLink = document.getElementById('signIn');
  this.signOutLink = document.getElementById('signOut');
  this.signInList = document.getElementById('signInList');
  this.signOutList = document.getElementById('signOutList');

  //top nav bar links and paged
  this.homeLink = document.getElementById('home');
  this.homePage = document.getElementById('homePage');
  this.aboutLink = document.getElementById('about');
  this.aboutPage = document.getElementById('aboutPage');
  this.fireboardsLink = document.getElementById('courses');
  this.fireboardsPage = document.getElementById('fireboardsPage');
  this.manageLink = document.getElementById('manageFireboards');
  this.managePage = document.getElementById('managePage');
  this.reportsLink = document.getElementById('reports');
  this.reportsPage = document.getElementById('reportsPage');
  this.announcementsLink = document.getElementById('announcements');
  this.announcementsPage = document.getElementById('announcementsPage');
  this.profileLink = document.getElementById('myProfile');
  this.profilePage = document.getElementById('profilePage');
  this.myFCLink = document.getElementById('myFireboards');
  this.myFCPage = document.getElementById('myFCPage');
  this.selectedCoursePage = document.getElementById('fireboardsSelectedFireCoursePage');

  //profile page
  this.userNameField = document.getElementById('userNameField');
  this.userEmailField = document.getElementById('userEmailField');
  this.bioTextArea = document.getElementById('bioTextArea');
  this.userPic = document.getElementById('userPic');
  this.updProfButton = document.getElementById('updProfButton');

  //manage page
  this.courseNameField = document.getElementById('courseNameField');
  this.courseDescField = document.getElementById('courseDescField');
  this.categorySel = document.getElementById('categorySel');
  this.courseTypeSel = document.getElementById('courseTypeSel');
  this.courseVidURL = document.getElementById('courseVidURL');
  this.courseURLVideo = document.getElementById('courseURLVideo');
  this.courseURLFile = document.getElementById('courseURLFile');
  this.uploadForm = document.getElementById('uploadForm');
  this.uploader = document.getElementById('uploader');
  this.uploadBox = document.getElementById('uploadBox');
  this.addCourse = document.getElementById('addCourse');

  //events for nav links
  this.homeLink.addEventListener('click', this.homeShow.bind(this));
  this.aboutLink.addEventListener('click', this.aboutShow.bind(this));
  this.fireboardsLink.addEventListener('click', this.coursesShow.bind(this));
  this.manageLink.addEventListener('click', this.manageShow.bind(this));
  this.reportsLink.addEventListener('click', this.reportsShow.bind(this));
  this.announcementsLink.addEventListener('click', this.announcementsShow.bind(this));
  this.profileLink.addEventListener('click', this.profileShow.bind(this));
  this.myFCLink.addEventListener('click', this.myFBShow.bind(this));

  //events for profile page
  this.updProfButton.addEventListener('click', this.updateUser.bind(this));

  //events for manage page
  this.courseTypeSel.addEventListener('change', this.showURLField.bind(this));
  this.uploadBox.addEventListener('change', this.uploadFile.bind(this));
  this.addCourse.addEventListener('click', this.addVideo.bind(this));

  //admin page
  this.adminMUAddUserBtn = document.getElementById('adminMUAddUserBtn');
  this.adminMURemoveUserBtn = document.getElementById('adminMURemoveUserBtn');

  this.adminMUAddUserBtn.addEventListener('click', this.addAdminUser.bind(this));
  this.adminMURemoveUserBtn.addEventListener('click', this.removeAdminUser.bind(this));

  //modal
  this.mySelectedCourse = "";
  this.takeCourseBtn = document.getElementById('takeCourseBtn');
  this.takeCourseBtn.addEventListener('click', this.takeCourse.bind(this));
  this.selectedPostData = null;

  this.backToFireboardsBtn = document.getElementById('backToFireboardsBtn');
  this.backToFireboardsBtn.addEventListener('click', this.myFBShow.bind(this));

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
  window.location.reload();
}

fireBoards.prototype.onAuthStateChanged = function(user) {
  if (user) { 
    
    this.signInList.setAttribute('class', 'hide');
    this.signOutList.removeAttribute('class');
    this.fireboardsLink.removeAttribute('class');
  	this.myFCLink.removeAttribute('class');
  	this.manageLink.removeAttribute('class');
  	this.reportsLink.removeAttribute('class');
  	this.profileLink.removeAttribute('class');
    this.addUserInDatabase(user);

  } else {
   	
    this.signInList.removeAttribute('class');
    this.signOutList.setAttribute('class', 'hide');
    this.fireboardsLink.setAttribute('class', 'hide');
  	this.myFCLink.setAttribute('class', 'hide');
  	this.manageLink.setAttribute('class', 'hide');
  	this.reportsLink.setAttribute('class', 'hide');
  	this.profileLink.setAttribute('class', 'hide');
  }
};

fireBoards.prototype.addUserInDatabase = function (user) {
  /*var userRef = this.database.ref('users/' + user.uid);
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
  });*/
  var adminFlag = false;

  this.database.ref().child('admins').orderByChild('email').equalTo(user.email).once('value').then(function (snapshot) {
   	if(snapshot.val() === null) {
   		console.log("not admin");
   		adminFlag = false;
   	} else {
   		console.log("admin");
   		adminFlag = true;
   	}
   	console.log("user" + user.uid); 
   	firebase.database().ref("users/" + user.uid).update({
		email: user.email,
		userName: user.displayName,
		bio: "Hey I'm cool!",
		photoUrl: user.photoURL || '/images/profile_placeholder.png',
		adminFlag: adminFlag
	});
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

fireBoards.prototype.removeAdminUser = function () {

	var currEmail = document.getElementById('adminMUEmailField').value;
    this.readyStateCounter = 0;
	console.log("removeAdminUser, " + currEmail);
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

    			// Set adminFlag to true in users node.
    			console.log("Deleted");
    			firebase.database().ref('/admins/' + key).remove();
    			break;
    		}
    	}
    });

}

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
			this.myFCPage.setAttribute('hidden', true);
			this.myFCLink.removeAttribute('class');
			this.fireboardsPage.setAttribute('hidden', true);
			this.fireboardsLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
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
			this.myFCPage.setAttribute('hidden', true);
			this.myFCLink.removeAttribute('class');
			this.fireboardsPage.setAttribute('hidden', true);
			this.fireboardsLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
		}
}

fireBoards.prototype.coursesShow = function() {
	this.fireboardsPage.removeAttribute('hidden');
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
			this.myFCPage.setAttribute('hidden', true);
			this.myFCLink.removeAttribute('class');
			this.homePage.setAttribute('hidden', true);
			this.homeLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
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
		this.myFCPage.setAttribute('hidden', true);
		this.myFCLink.removeAttribute('class');
		this.fireboardsPage.setAttribute('hidden', true);
		this.fireboardsLink.removeAttribute('class');
		this.selectedCoursePage.setAttribute('hidden', true);
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
		this.myFCPage.setAttribute('hidden', true);
		this.myFCLink.removeAttribute('class');
		this.fireboardsPage.setAttribute('hidden', true);
		this.fireboardsLink.removeAttribute('class');
		this.selectedCoursePage.setAttribute('hidden', true);
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
			this.myFCPage.setAttribute('hidden', true);
			this.myFCLink.removeAttribute('class');
			this.fireboardsPage.setAttribute('hidden', true);
			this.fireboardsLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
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
		this.myFCPage.setAttribute('hidden', true);
		this.myFCLink.removeAttribute('class');
		this.fireboardsPage.setAttribute('hidden', true);
		this.fireboardsLink.removeAttribute('class');
		this.selectedCoursePage.setAttribute('hidden', true);

		this.userNameField.setAttribute('value', this.auth.currentUser.displayName);
		this.userEmailField.setAttribute('value', this.auth.currentUser.email);
		this.userPic.setAttribute('src', this.auth.currentUser.photoURL);

		var userRef = this.database.ref('users/' + this.auth.currentUser.uid).once('value', function(snapshot) {
			bioTextArea.setAttribute('value', snapshot.child("bio").val());
			adminFlagField.setAttribute('value', snapshot.child("adminFlag").val() ? 'Yes' : 'No');
		}).catch(e => {
			console.log("Bio is currently null.");
		});

}

fireBoards.prototype.myFBShow = function() {
	this.myFCPage.removeAttribute('hidden');
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
		this.fireboardsPage.setAttribute('hidden', true);
		this.fireboardsLink.removeAttribute('class');
		this.selectedCoursePage.setAttribute('hidden', true);
}

fireBoards.prototype.validateAddCourse = function () {

  	var reqFields = "";
  	if(this.categorySel.value === "" || this.categorySel.value === null) {
  		reqFields += "Category";
  	}
  	if(this.courseDescField.value === "" || this.courseDescField.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Description";
  		} else {
  			reqFields += "Course Description";
  		}
  	}
  	if(this.courseNameField.value === "" || this.courseNameField.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Name/Title";
  		} else {
  			reqFields += "Course Name/Title";
  		}
  	}
  	if(this.courseTypeSel.value === "" || this.courseTypeSel.value === null) {
  		if (reqFields !== "") {
  			reqFields += ", Course Type";
  		} else {
  			reqFields += "Course Type";
  		}

  		if ((this.courseTypeSel.value !== "File" && (this.courseVidURL === null || this.courseVidURL === "")) ||
  			(this.courseTypeSel.value !== "Video" && (this.courseURLFile === null || this.courseURLFile === ""))) {
  			if (reqFields !== "") {
  				reqFields += ", Course URL";
	  		} else {
	  			reqFields += "Course URL";
	  		}
  		}
  	}

  	console.log(reqFields);

  	if(reqFields !== "") {
      	alert("Please populate below required field(s): \n" + reqFields);
      	window.uploadForm.reset();
      	return false;
    } else {
    	return true;
    }
}

fireBoards.prototype.uploadFile = function(e) {

	if(this.validateAddCourse()) {
  e.preventDefault();
			var file = e.target.files[0];
		      var metadata = {
		          'contentType': file.type
		      };
		      var storageRef = this.storage.ref('fireboards/' + this.categorySel.value + "/" + this.auth.currentUser.uid + '_' + this.courseNameField.value);

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
		            var downloadURL = task.snapshot.downloadURL;

					var postData = {
					    category: categorySel.value,
					    courseBannerURL: 'assets/images/DefaultFileBanner.png',
					    courseDescription: courseDescField.value,
					    courseName: courseNameField.value,
					    courseType: courseTypeSel.value,
					    courseURL: downloadURL,
					    overallRating: 0,
					    popularity: 0,
					    uploadDate: Date.now(),
					    uploadedBy: firebase.auth().currentUser.email
					};

		            var coursesRef = firebase.database().ref('fireCourses').push(postData, snap => {
		            	alert('New course added!');
            			window.uploadForm.reset();
                    	uploader.value = 0;
		            });

  		        }
		      );
	}
}

fireBoards.prototype.addVideo = function() {
	if(this.validateAddCourse()) {
		var postData = {
			    category: categorySel.value,
			    courseBannerURL: 'assets/images/DefaultVideoBanner.png',
			    courseDescription: courseDescField.value,
			    courseName: courseNameField.value,
			    courseType: courseTypeSel.value,
			    courseURL: courseVidURL.value,
			    overallRating: 0,
			    popularity: 0,
			    uploadDate: Date.now(),
			    uploadedBy: firebase.auth().currentUser.email
			};
            var coursesRef = firebase.database().ref('fireCourses').push(postData, snap => {
            	alert('New course added!');
            	window.uploadForm.reset();
            });
        }
}

fireBoards.prototype.updateUser = function(user) {
  	if(this.value !== null && this.bio.value !== "") {
	    var updateUserPost = {
	      bio : this.bioTextArea.value
	    };
	    var userRef = this.database.ref('users/' + user.uid);
	    userRef.update(updateUserPost);
	    console.log("User bio updated on DB.");
	    alert("Profile updated!");
	}
}

fireBoards.prototype.showURLField = function() {
	if(this.courseTypeSel.value !== 'File') {
		this.courseURLVideo.removeAttribute('hidden');
		this.addCourse.removeAttribute('hidden');
		this.courseURLFile.setAttribute('hidden', 'true');
		this.uploader.setAttribute('hidden', 'true');
	} else {
		this.courseURLFile.removeAttribute('hidden');
		this.uploader.removeAttribute('hidden');
		this.courseURLVideo.setAttribute('hidden', 'true');
		this.addCourse.setAttribute('hidden', 'true');
	}
}

fireBoards.prototype.addCourseToLearn = function(courseId) {
	var coursesRef = this.database.ref('fireCourses/' + courseId).once('value', function(snapshot) {
		var postData = {
			category: snapshot.child("category").val(),
			completionDateTime: 0,
			courseName: snapshot.child("courseName").val(),
			myRating: 0,
			overallRating: snapshot.child("overallRating").val(),
			popularity: snapshot.child("popularity").val(),
			status: "In Progress"
		};

		var coursesRef = firebase.database().ref('userCourses/' + this.auth.currentUser.uid + '/' + courseId).set(postData, snap => {
            alert('Course was added to your Fireboards list!');
            var rootRef = firebase.database().ref();
            var updatePopularity = {};

            updatePopularity['/fireCourses/' + courseId + '/popularity'] = snapshot.child("popularity").val()+1;
  			updatePopularity['/userCourses/' + this.auth.currentUser.uid + '/' + courseId + '/popularity'] = snapshot.child("popularity").val()+1;

  			var updates = rootRef.update(updates);
  			console.log("Popularity updated for " + courseId);

         });
	}).catch(e => {
		console.error("Firecourses node is having an error. Please try again", e.message());
	});
}

fireBoards.prototype.listAdminUsers = function () {

	console.log("List Admin Users");

	firebase.database().ref('/admins/').once('value').then(function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		//currEmail = document.getElementById('adminMUEmailField').value;

		$('#listOfAdminUsers').empty();
		for (var key in snapshot.val())
		{
			console.log(arr[key].email);
			$('<p>').text(arr[key].email).appendTo($('#listOfAdminUsers'));
    	}
    });

}

fireBoards.prototype.listFireCourses = function () {

	var fireCoursesCounter = 0;
	var elementsID = [];
	console.log("List FireCourses");

	firebase.database().ref('/fireCourses/').once('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		//currEmail = document.getElementById('adminMUEmailField').value;

		//$('#listOfFireCourseSpan').empty();

		$('#listOfFireCourseSpan').empty();
		for (var key in snapshot.val())
		{
			console.log(arr[key].courseDescription + ": " + fireCoursesCounter);
			$('#listOfFireCourseSpan').append($('<li class="col-lg-3 col-sm-4 col-xs-6" id="courseLnk' + fireCoursesCounter + '"><a href="#" style="width:300px; height:250px;"><h1 class="courseHeaders">' + arr[key].courseName + '</h1><br><p>' + arr[key].courseDescription + '</p></a></li>'));
			/*$('#courseLnk' + fireCoursesCounter).click(function () {
    			console.log("what: " + fireCoursesCounter);
    		});*/

    		elementsID.push('courseLnk' + fireCoursesCounter);

    		document.getElementById('courseLnk' + fireCoursesCounter).addEventListener('click', function(event) {
				console.log("Yay! " + this.id);

				fireBoards.showSelectedCourse(elementsID, this.id);
			});
			//$('<h1>').text(arr[key].courseName).appendTo($('#fireCourseSpan'));
			//$('<p>').text(arr[key].courseDescription).appendTo($('#fireCourseSpan'));

			fireCoursesCounter++;
    	}

    	console.log(elementsID[0]);
    	/*
    	var courseLinks = document.getElementsByClassName('courseLnk');
		for (var i = 0; i < courseLinks.length; i++)
		{
			courseLinks[i].addEventListener('click', function() {
				console.log("Yay!");
			});
		}*/
    });

}

fireBoards.prototype.showSelectedCourse = function (elementsArray, elementID) {
	console.log("Get Course UID from Element ID");
	var courseIndex;
	var courseID;

	courseIndex = elementsArray.indexOf(elementID);
	console.log("Course is at index " + courseIndex);

	firebase.database().ref('/fireCourses/').once('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		var ctr = 0;

		for (var key in snapshot.val())
		{
			if (ctr == courseIndex)
			{
				console.log("Found Course: " + arr[key].courseName);

				fireBoards.selectedPostData = {
					category: arr[key].category,
					completionDateTime: null,
					courseDescription: arr[key].courseDescription,
					courseName: arr[key].courseName,
					myRating: null,
					overallRating: arr[key].overallRating,
					popularity: arr[key].popularity,
					status: "In Progress"
				};

				fireBoards.mySelectedCourse = key;
				console.log(fireBoards.mySelectedCourse);

					console.log("Modal appear!");

					// Get the modal
					var modal = document.getElementById('courseModal');
					
					// Get the button that opens the modal
					var takeBtn = document.getElementById("takeCourseBtn");
					
					// Get the <span> element that closes the modal
					var span = document.getElementsByClassName("close")[0];
	
					modal.style.display = "block";

					$('#selectedCourseFCH3').text(arr[key].courseName);
					$('#selectedCourseFCPar').text(arr[key].courseDescription);
	
				var modalCallback = function(exists)
				{
					if (exists)
					{
						console.log("Bye button");
						takeBtn.style.display = "none";
					}
				}

				fireBoards.checkIfCourseIsTaken(modalCallback);

				takeBtn.onclick = function() {
					console.log("Took " + fireBoards.mySelectedCourse);
	
					var uid = firebase.auth().currentUser.uid;
	
					firebase.database().ref("userCourses/" + uid + "/" + fireBoards.mySelectedCourse).update(fireBoards.selectedPostData);
	
					//$('#takeCourseBtn').text('Taken');

				}
	
				span.onclick = function() {
					modal.style.display = "none";
				}

				window.onclick = function(event) {
				    if (event.target == modal) {
				        modal.style.display = "none";
				    }
				}	

				break;
			}
		ctr++;
		}

	});
}

fireBoards.prototype.checkIfCourseIsTaken = function (callback) {

	console.log("Checking..");
	firebase.database().ref('/userCourses').once('value', function(snapshot) {
		if (!snapshot.hasChild(firebase.auth().currentUser.uid)){
			console.log("User has no courses.");
			callback(false);
			return;
		}
		else
		{
			console.log("User has courses");
			firebase.database().ref('/userCourses/' + firebase.auth().currentUser.uid).on('value', function (snapshot) {
				var arr = snapshot.val();
				var arr2 = Object.keys(arr);
				var key = arr2[0];
		
				for (var key in snapshot.val())
				{
					console.log(fireBoards.mySelectedCourse + " and " + key);
					if (fireBoards.mySelectedCourse == key)
					{
						callback(true);
						return;
					}
				}
					
				callback(false);
				return;
			});
		}
	});
}

fireBoards.prototype.listMyFireCourses = function () {

	var myfireCoursesCounter = 0;
	var elementsID = [];

	console.log("List of My FireCourses");

	// TODO: Remove
	var uid = "ENJG0kUdPzS0dmlSrpaFbyzN1YN2";

	firebase.database().ref('/userCourses/' + uid).once('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		//currEmail = document.getElementById('adminMUEmailField').value;

		console.log("Hi");
		$('#listOfMyFireCourseSpan').empty();
		for (var key in snapshot.val())
		{
			console.log("User Course: " + arr[key].courseName);
			$('#listOfMyFireCourseSpan').append($('<li class="col-lg-3 col-sm-4 col-xs-6" id="myCourseLnk' + myfireCoursesCounter + '"><a href="#" style="width:300px; height:250px;"><h1 class="courseHeaders">' + arr[key].courseName + '</h1><br><p>' + arr[key].courseDescription + '</p></a></li>'));
    		
    		elementsID.push('myCourseLnk' + myfireCoursesCounter);

    		document.getElementById('myCourseLnk' + myfireCoursesCounter).addEventListener('click', function(event) {
				console.log("My Course! " + this.id);

				fireBoards.showMySelectedCourse(elementsID, this.id);
			});
			//$('<h1>').text(arr[key].courseName).appendTo($('#fireCourseSpan'));
			//$('<p>').text(arr[key].courseDescription).appendTo($('#fireCourseSpan'));

			myfireCoursesCounter++;
    	}

    	console.log(elementsID[0]);
    });
}

fireBoards.prototype.showMySelectedCourse = function (elementsArray, elementID) {
	console.log("Get Course UID from Element ID");
	var courseIndex;
	var courseID;

	// TODO: Remove
	var uid = "ENJG0kUdPzS0dmlSrpaFbyzN1YN2";

	courseIndex = elementsArray.indexOf(elementID);
	console.log("Course is at index " + courseIndex);

	firebase.database().ref('/userCourses/' + uid).once('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		var ctr = 0;

		for (var key in snapshot.val())
		{
			if (ctr == courseIndex)
			{
				console.log("Found Course: " + arr[key].courseName);

				fireBoards.selectedCoursePage.removeAttribute('hidden');
				fireBoards.myFCPage.setAttribute('hidden', true);

				$('#selectedCourseH1').text(arr[key].courseName);
				$('#selectedCoursePar').text(arr[key].courseDescription);

				break;
			}
			ctr++;
		}


	});
}

fireBoards.prototype.takeCourse = function () {

}

fireBoards.prototype.initializeFireboardsUI = function () {

	console.log("Initializing Fireboards UI");
	var courseLinks = document.getElementsByClassName('courseLink');

	for (var i = 0; i < courseLinks.length; i++)
	{
		courseLinks[i].addEventListener('click', function() {
			console.log("Yay!");
		});
	}

}

window.onload = function() {
  window.fireBoards = new fireBoards();

  fireBoards.listAdminUsers();
  fireBoards.listMyFireCourses();
  fireBoards.listFireCourses();
  //fireBoards.initializeFireboardsUI();
};