'use strict';
var adminFlag = "false";
var currentSelectedCourse = "";
var selectCourseClick = false;
var currentReportSelectedCourse = "";
var userIsRegistered = false;
var updatedPopularity = 0;

function fireBoards() {
  this.checkSetup();

  //sign in and out objects
  this.signInLink = document.getElementById('signIn');
  this.signOutLink = document.getElementById('signOut');
  this.signInList = document.getElementById('signInList');
  this.signOutList = document.getElementById('signOutList');

  //top nav bar links and pages
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
  this.profileBio = document.getElementById('profileBio');
  this.searchSel = document.getElementById('searchSel');
  this.searchProfileField = document.getElementById('searchProfileField');
  this.searchProfileBtn = document.getElementById('searchProfileBtn');
  this.searchProfileList = document.getElementById('searchProfileList');

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

  //reports page
  this.reportsCategorySel = document.getElementById('reportsCategorySel');

  //announcements page
  this.announcementAdminSection = document.getElementById('announcementAdminSection');
  this.announcementForm = document.getElementById('announcementForm');
  this.announcementTitle = document.getElementById('announcementTitle');
  this.announcementDetails = document.getElementById('announcementDetails');
  this.postAnnouncement = document.getElementById('postAnnouncement');
  this.announcementList = document.getElementById('announcementList');

  //admin page
  this.adminMUAddUserBtn = document.getElementById('adminMUAddUserBtn');
  this.adminMURemoveUserBtn = document.getElementById('adminMURemoveUserBtn');

  //comments
  this.commentsTextArea = document.getElementById('commentsTextArea');
  this.addComment = document.getElementById('addComment');
  this.commentForm = document.getElementById('commentForm');

  //rating
  this.star1 = document.getElementById('star1');
  this.star2 = document.getElementById('star2');
  this.star3 = document.getElementById('star3');
  this.star4 = document.getElementById('star4');
  this.star5 = document.getElementById('star5');

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
  this.searchProfileBtn.addEventListener('click', this.searchProfile.bind(this));

  //events for manage page
  this.courseTypeSel.addEventListener('change', this.showURLField.bind(this));
  this.uploadBox.addEventListener('change', this.uploadFile.bind(this));
  this.addCourse.addEventListener('click', this.addVideo.bind(this));

  //events for reports page
  this.reportsCategorySel.addEventListener('change', this.reportGetCourse.bind(this));

  //events for admin page
  this.adminMUAddUserBtn.addEventListener('click', this.addAdminUser.bind(this));
  this.adminMURemoveUserBtn.addEventListener('click', this.removeAdminUser.bind(this));

  //for modal
  this.mySelectedCourse = "";
  this.selectedPostData = null;

  //events for selected course page
  this.openMaterialBtn = document.getElementById('openMaterialBtn');
  this.tagCompletedBtn = document.getElementById('tagCompletedBtn');
  this.cancelRegistrationBtn = document.getElementById('cancelRegistrationBtn');
  this.backToFireboardsBtn = document.getElementById('backToFireboardsBtn');

  this.openMaterialBtn.addEventListener('click', this.openMaterial.bind(this));
  this.tagCompletedBtn.addEventListener('click', this.tagCompleted.bind(this));
  this.cancelRegistrationBtn.addEventListener('click', this.cancelRegistration.bind(this));

  this.backToFireboardsBtn.addEventListener('click', this.myFBShow.bind(this));

  //events for announcements page
  this.postAnnouncement.addEventListener('click', this.postNewAnnouncement.bind(this));

  //sign in and out events
  this.signOutList.addEventListener('click', this.signOut.bind(this));
  this.signInList.addEventListener('click', this.signIn.bind(this));

  //firebase initialization
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
    console.log("onAuthStateChanged user is logged in");

    this.signInList.setAttribute('class', 'hide');
    this.signOutList.removeAttribute('class');
    this.fireboardsLink.removeAttribute('class');
  	this.myFCLink.removeAttribute('class');
  	//this.manageLink.removeAttribute('class');
  	//this.reportsLink.removeAttribute('class');
  	this.profileLink.removeAttribute('class');
  	this.announcementsLink.removeAttribute('class');
    this.addUserInDatabase(user);
    this.showAddedCourses();
    this.showPostedAnnouncements();
  	this.listAdminUsers();
  	this.listFireCourses();

  	this.database.ref('/userCourses/').on('value', function(snapshot) {
  		console.log("Read List My FireCourses");
  		if (snapshot.hasChild(firebase.auth().currentUser.uid)){
  			console.log("HAS CHILD!?");
  			fireBoards.listMyFireCourses();
		}
  	});

  	this.reportListCategories();

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

  this.database.ref().child('admins').orderByChild('email').equalTo(user.email).once('value').then(function (snapshot) {
   	if(snapshot.val() === null) {
   		console.log("not admin");
   		adminFlag = false;
   	} else {
   		console.log("admin");
   		adminFlag = true;
   	}
   	console.log("user" + user.uid); 

   	var userRef = firebase.database().ref("users/" + user.uid);
 	userRef.once('value', function(snapshot) {
    if (snapshot.val() === null) {
      userRef.set({
        email: user.email,
		userName: user.displayName,
		bio: "Hey I'm cool!",
		photoUrl: user.photoURL || '/assets/images/profile_placeholder.png',
		adminFlag: adminFlag
      }).then(function(){
          if (adminFlag == true) {
              $("#announcementAdminSection").show();
              fireBoards.adminPage();
          }          
          console.log("then " + adminFlag);
        });

      console.log("User inserted on DB.");
    } else {
        userRef.update({
		email: user.email,
		userName: user.displayName,
		photoUrl: user.photoURL || '/assets/images/profile_placeholder.png',
		adminFlag: adminFlag
      }).then(function(){
          if (adminFlag == true) {
            $("#announcementAdminSection").show();
             fireBoards.adminPage();
          } 
          console.log("then " + adminFlag);
        });

      console.log("User updated on DB.");
    }
	});
	
  });

  
};

fireBoards.prototype.adminPage = function () {
  console.log("adminPage")
  this.manageLink.removeAttribute('class');
  this.reportsLink.removeAttribute('class');
}

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

	firebase.database().ref('/users/').on('value', function (snapshot) {
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

	firebase.database().ref('/users/').on('value', function (snapshot) {
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

		if(this.auth.currentUser && adminFlag == true) {
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
			this.fireboardsPage.setAttribute('hidden', true);
			this.fireboardsLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
		} else {
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
      this.profilePage.setAttribute('hidden', true);
      this.profileLink.removeAttribute('class');
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

		if(this.auth.currentUser && adminFlag == true) {
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
			this.fireboardsPage.setAttribute('hidden', true);
			this.fireboardsLink.removeAttribute('class');
			this.selectedCoursePage.setAttribute('hidden', true);
		} else {
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
      this.profilePage.setAttribute('hidden', true);
      this.profileLink.removeAttribute('class');
      this.myFCPage.setAttribute('hidden', true);
      this.myFCLink.removeAttribute('class');
      this.fireboardsPage.setAttribute('hidden', true);
      this.fireboardsLink.removeAttribute('class');
      this.selectedCoursePage.setAttribute('hidden', true);
    }
}

fireBoards.prototype.coursesShow = function() {
	this.fireboardsPage.removeAttribute('hidden');
    this.homePage.setAttribute('hidden', true);
    this.homeLink.removeAttribute('class');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');

    if(this.auth.currentUser && adminFlag == true) {
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
			this.selectedCoursePage.setAttribute('hidden', true);
    } else {
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
      this.profilePage.setAttribute('hidden', true);
      this.profileLink.removeAttribute('class');
      this.myFCPage.setAttribute('hidden', true);
      this.myFCLink.removeAttribute('class');
      this.selectedCoursePage.setAttribute('hidden', true);
    }
}

fireBoards.prototype.manageShow = function() {
	this.managePage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
		this.announcementsPage.setAttribute('hidden', true);
		this.announcementsLink.removeAttribute('class');
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
        this.showAddedCourses();
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

		if (this.auth.currentUser && adminFlag == true) {
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
		} else {
      this.profilePage.setAttribute('hidden', true);
      this.profileLink.removeAttribute('class');
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
    this.homePage.setAttribute('hidden', true);
    this.homeLink.removeAttribute('class');
    this.announcementsPage.setAttribute('hidden', true);
    this.announcementsLink.removeAttribute('class');

    console.log(adminFlag);
    if (this.auth.currentUser && adminFlag == true) {
    	console.log("Wew");
  		this.reportsPage.setAttribute('hidden', true);
  		this.reportsLink.removeAttribute('class');
  		this.managePage.setAttribute('hidden', true);
  		this.manageLink.removeAttribute('class');
  		this.myFCPage.setAttribute('hidden', true);
  		this.myFCLink.removeAttribute('class');
  		this.fireboardsPage.setAttribute('hidden', true);
  		this.fireboardsLink.removeAttribute('class');
  		this.selectedCoursePage.setAttribute('hidden', true);
    } else {
      this.myFCPage.setAttribute('hidden', true);
      this.myFCLink.removeAttribute('class');
      this.fireboardsPage.setAttribute('hidden', true);
      this.fireboardsLink.removeAttribute('class');
      this.selectedCoursePage.setAttribute('hidden', true);
    }

		$('#userNameHeader').text(this.auth.currentUser.displayName);
		this.userNameField.setAttribute('value', this.auth.currentUser.displayName);
		this.userEmailField.setAttribute('value', this.auth.currentUser.email);
		this.userPic.setAttribute('src', this.auth.currentUser.photoURL);

		var userRef = this.database.ref('users/' + this.auth.currentUser.uid).on('value', function(snapshot) {
			bioTextArea.value = snapshot.child("bio").val();
			adminFlagField.setAttribute('value', snapshot.child("adminFlag").val() ? 'Yes' : 'No');
			profileBio.innerHTML = '<i><span class="fa fa-quote-left" />&nbsp;&nbsp;' + snapshot.child("bio").val() + '&nbsp;&nbsp;<span class="fa fa-quote-right" /></i>';
		});

}

fireBoards.prototype.myFBShow = function() {
	this.myFCPage.removeAttribute('hidden');
		this.aboutPage.setAttribute('hidden', true);
		this.aboutLink.removeAttribute('class');
    this.announcementsPage.setAttribute('hidden', true);
    this.announcementsLink.removeAttribute('class');
    this.homePage.setAttribute('hidden', true);
    this.homeLink.removeAttribute('class');

    if (this.auth.currentUser && adminFlag == true) { 
		this.reportsPage.setAttribute('hidden', true);
		this.reportsLink.removeAttribute('class');
		this.profilePage.setAttribute('hidden', true);
		this.profileLink.removeAttribute('class');
		this.managePage.setAttribute('hidden', true);
		this.manageLink.removeAttribute('class');
		this.fireboardsPage.setAttribute('hidden', true);
		this.fireboardsLink.removeAttribute('class');
		this.selectedCoursePage.setAttribute('hidden', true);
    } else {
    this.profilePage.setAttribute('hidden', true);
    this.profileLink.removeAttribute('class');
    this.fireboardsPage.setAttribute('hidden', true);
    this.fireboardsLink.removeAttribute('class');
    this.selectedCoursePage.setAttribute('hidden', true); 
    }
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
		      var storageRef = this.storage.ref('fireboards/' + this.categorySel.value + "/" + this.courseNameField.value);

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

fireBoards.prototype.updateUser = function() {
  	if(this.bioTextArea.value !== null && this.bioTextArea.value !== "") {
	    var updateUserPost = {
	      bio : bioTextArea.value
	    };
	    var userRef = this.database.ref('users/' + this.auth.currentUser.uid);
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
			courseDescription: snapshot.child("courseDescription").val(),
			courseBannerURL: snapshot.child("courseBannerURL").val(),
			myRating: 0,
			overallRating: snapshot.child("overallRating").val(),
			popularity: snapshot.child("popularity").val(),
			status: "In Progress"
		};

		var coursesRef = firebase.database().ref('userCourses/' + firebase.auth().currentUser.uid + '/' + courseId).set(postData, snap => {
            alert('Course was added to your Fireboards list!');
            var rootRef = firebase.database().ref();
            var updatePopularity = {};

            updatePopularity['/fireCourses/' + courseId + '/popularity'] = snapshot.child("popularity").val()+1;
  			updatePopularity['/userCourses/' + firebase.auth().currentUser.uid + '/' + courseId + '/popularity'] = snapshot.child("popularity").val()+1;

  			var updates = rootRef.update(updatePopularity);
  			console.log("Popularity updated for " + courseId);

         });
	}).catch(e => {
		console.error("Firecourses node is having an error. Please try again", e.message());
	});
}

fireBoards.prototype.showAddedCourses = function() {
	var coursesRef = this.database.ref('fireCourses').on('value', function(snapshot) {
		var objects = snapshot.val();
	    $('#courseList').empty();
	    if (objects === null) {
	      $('#courseList').append($('<li/>',{
	          html: '<p style="font-weight:700">No courses added yet.</p>'
	        }));
	    } else {
	      for(var key in objects){
	      	var date = new Date(objects[key].uploadDate);
	        $('#courseList').append($('<li/>',{
	          html: '<img src="' + objects[key].courseBannerURL + '" style="width:30px; height:auto" />&nbsp;&nbsp;<a style="color:black; font-weight:900" href="' + objects[key].courseURL + '" title="View '+ objects[key].courseName + '" target="_blank">' +
	           objects[key].courseName + '</a><button onClick="deleteCourse(\'' + key + '\', \'' + objects[key].courseName + '\', \'' + objects[key].category + '\');" title="Delete Course" class="fa fa-remove" style="color:red; border:none; background-color:transparent" /><i><br>Course Description: ' + 
	           objects[key].courseDescription + '<br>Category Code: ' + objects[key].category + '<br>Uploaded By: ' + objects[key].uploadedBy + '<br>Upload Date: ' + formatDate(date) + '</i><br><br><br>'
	        }));
	      }
	    }
	});
}

fireBoards.prototype.listAdminUsers = function () {

	console.log("List Admin Users");

	firebase.database().ref('/admins/').on('value', function (snapshot) {
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

	firebase.database().ref('/fireCourses/').on('value', function (snapshot) {
		console.log("DATABASE TRIGGERED: listFireCourses");
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		elementsID = [];

		fireCoursesCounter = 0;
		$('#listOfFireCourseSpan').empty();
		for (var key in snapshot.val())
		{
			console.log(arr[key].courseDescription + ": " + fireCoursesCounter);
			$('#listOfFireCourseSpan').append($('<li class="col-lg-3 col-sm-4 col-xs-6" id="courseLnk' + fireCoursesCounter + '"><a href="#" style="width:350px; height:250px;"><h1 class="courseHeaders">' + arr[key].courseName + '</h1><br><p>' + arr[key].courseDescription + '</p></a></li>'));

    		elementsID.push('courseLnk' + fireCoursesCounter);

    		document.getElementById('courseLnk' + fireCoursesCounter).addEventListener('click', function(event) {
				console.log("Yay! " + this.id);
				selectCourseClick = true;
				fireBoards.showSelectedCourse(elementsID, this.id);
			});

			fireCoursesCounter++;
    	}
    });

}

fireBoards.prototype.showSelectedCourse = function (elementsArray, elementID) {
	console.log("Get Course UID from Element ID");
	var courseIndex;
	var courseID;

	courseIndex = elementsArray.indexOf(elementID);
	console.log("Course is at index " + courseIndex);

	firebase.database().ref('/fireCourses/').on('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		var ctr = 0;

		for (var key in snapshot.val())
		{
			if (ctr == courseIndex)
			{
				console.log("Found Course: " + arr[key].courseName);

				showCourseComments(key);
				initiateRatingObjects(key);

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

				if (selectCourseClick)
				{
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
					$('#modalCourseRating').text(arr[key].overallRating);
					$('#modalPopularity').text(arr[key].popularity);
					
					var modalCallback = function(exists)
					{
						if (exists)
						{
							takeBtn.style.display = "none";
						}
						else
						{
							takeBtn.style.display = "block";
						}
					}

					fireBoards.checkIfCourseIsTaken(modalCallback);

					takeBtn.onclick = function() {
						console.log("Took " + fireBoards.mySelectedCourse);
						
						var uid = firebase.auth().currentUser.uid;
							
						fireBoards.addCourseToLearn(fireBoards.mySelectedCourse);
						//firebase.database().ref("userCourses/" + uid + "/" + fireBoards.mySelectedCourse).update(fireBoards.selectedPostData);
						
						//$('#takeCourseBtn').text('Taken');
	
					}
					
					span.onclick = function() {
						modal.style.display = "none";
						selectCourseClick = false;
					}

					window.onclick = function(event) {
					    if (event.target == modal) {
					        modal.style.display = "none";
					        selectCourseClick = false;
					    }
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
	firebase.database().ref('/userCourses').on('value', function(snapshot) {
		if (!snapshot.hasChild(firebase.auth().currentUser.uid)){
			console.log("User has no courses.");
			callback(false);
			return;
		}
		else
		{
			console.log("User has courses");
			firebase.database().ref('/userCourses/' + firebase.auth().currentUser.uid).on('value', function (snapshot) {
				if(snapshot.val() === null)
				{
					return;
				}

				var arr = snapshot.val();
				var arr2 = Object.keys(arr);
				var key = arr2[0];
		
				for (var key in snapshot.val())
				{
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

fireBoards.prototype.postNewAnnouncement = function() {

	var reqFields = "";

	if (this.announcementTitle.value === "" || this.announcementTitle === null) {
		reqFields += "Title";
	}

	if (this.announcementDetails.value === "" || this.announcementDetails.value === null) {
		if (reqFields !== "") {
  			reqFields += ", Details";
  		} else {
  			reqFields += "Details";
  		}
	}

	if (reqFields !== "") {
      	alert("Please populate below required field(s): \n" + reqFields);
	} else {
		var postData = {
			details: announcementDetails.value,
			postDate: Date.now(),
			postedBy: this.auth.currentUser.email,
			title: announcementTitle.value
		};

		var announceRef = this.database.ref('announcements').push(postData, snap => {
		   	alert('New announcement posted!');
        	window.announcementForm.reset();
		});
	}

}

fireBoards.prototype.showPostedAnnouncements = function() {
	var coursesRef = this.database.ref('announcements').orderByChild('postDate').on('value', function(snapshot) {
		var objects = snapshot.val();
	    $('#announcementList').empty();
	    if (objects === null) {
	      $('#announcementList').append($('<li/>',{
	          html: '<p style="font-weight:700">No announcements posted yet.</p>'
	        }));
	    } else {
	      for(var key in objects){
	      	var date = new Date(objects[key].postDate);
	      	if(adminFlag) {
		        $('#announcementList').append($('<li/>',{
		          html: '<span class="fa fa-exclamation" style="font-weight:900"></span>&nbsp;&nbsp;<b>' + objects[key].title + '</b><button onClick="deleteAnnouncement(\'' + key + '\');" title="Delete Announcement" class="fa fa-remove" style="color:red; border:none; background-color:transparent" />' + 
		          '<br>' + objects[key].details + '<br><br><i>Posted By: ' + objects[key].postedBy + '<br>Post Date: ' + formatDate(date) + '</i><br><br><br>'
		        }));
	      	} else {
		        $('#announcementList').append($('<li/>',{
		          html: '<span class="fa fa-exclamation" style="font-weight:900"></span>&nbsp;&nbsp;<b>' + objects[key].title + '</b>' + 
		          '<br>' + objects[key].details + '<br><br><i>Posted By: ' + objects[key].postedBy + '<br>Post Date: ' + formatDate(date) + '</i><br><br><br>'
		        }));
	      	}
	      }
	    }
	});
}

fireBoards.prototype.searchProfile = function () {

	var searchBy;

	if(this.searchSel.value === "Email") {
		searchBy = 'email';
	} else {
		searchBy = 'userName';
	}

	var usersRef = this.database.ref('users').orderByChild(searchBy).equalTo(searchProfileField.value).on('value', function(snapshot) {
		var objects = snapshot.val();
	    $('#searchProfileList').empty();
	    if (objects === null) {
	      $('#searchProfileList').append($('<li/>',{
	          html: '<p style="font-weight:700">No users matched the search keyword. <i>"' + fireBoards.searchProfileField.value + '"<i></p>'
	        }));
	    } else {
	      for(var key in objects){
	        $('#searchProfileList').append($('<li/>',{
	          html: '<br><img src="' + objects[key].photoUrl + '" style="width:200px;height:auto"><br>' + objects[key].userName + '<br>' + objects[key].email + '<br> <i><span class="fa fa-quote-left" />&nbsp;&nbsp;'+ objects[key].bio + '&nbsp;&nbsp;<span class="fa fa-quote-right" /></i>'
	        }));
	      }
	    }
	});
}

fireBoards.prototype.listMyFireCourses = function () {

	var myfireCoursesCounter = 0;
	var elementsID = [];

	console.log("List of My FireCourses");

	firebase.database().ref('/userCourses/' + firebase.auth().currentUser.uid).on('value', function (snapshot) {
		if(snapshot.val() === null)
		{
			$('#listOfMyFireCourseSpan').empty();
			return;
		}
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		elementsID = [];
		//currEmail = document.getElementById('adminMUEmailField').value;

		$('#listOfMyFireCourseSpan').empty();
		for (var key in snapshot.val())
		{
			//console.log("User Course: " + arr[key].courseName);
			$('#listOfMyFireCourseSpan').append($('<li class="col-lg-3 col-sm-4 col-xs-6" id="myCourseLnk' + myfireCoursesCounter + '"><a href="#" style="width:350px; height:250px;"><h1 class="courseHeaders">' + arr[key].courseName + '</h1><br><p>' + arr[key].courseDescription + '</p></a></li>'));
    		
    		elementsID.push('myCourseLnk' + myfireCoursesCounter);

    		document.getElementById('myCourseLnk' + myfireCoursesCounter).addEventListener('click', function(event) {
				//console.log("My Course! " + this.id);

				fireBoards.showMySelectedCourse(elementsID, this.id);
			});
			//$('<h1>').text(arr[key].courseName).appendTo($('#fireCourseSpan'));
			//$('<p>').text(arr[key].courseDescription).appendTo($('#fireCourseSpan'));

			myfireCoursesCounter++;
    	}
    });
}

fireBoards.prototype.showMySelectedCourse = function (elementsArray, elementID) {
	console.log("Get Course UID from Element ID");
	var courseIndex;
	var courseID;

	courseIndex = elementsArray.indexOf(elementID);
	

	var courseId;
	firebase.database().ref('/userCourses/' + firebase.auth().currentUser.uid).on('value', function (snapshot) {
		console.log("DATABASE TRIGGERED: showMySelectedCourse");
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		var ctr = 0;

		$('#courseBannerSpan').empty();
		console.log("Course is at index " + courseIndex);

		for (var key in snapshot.val())
		{
			if (ctr == courseIndex)
			{
				console.log("Found Course: " + arr[key].courseName);
				currentSelectedCourse = key;

				$('#selectedCourseH1').text(arr[key].courseName);
				$('#selectedCoursePar').text(arr[key].courseDescription);
				courseId = key;

				$('#courseRatingSpan').text(arr[key].overallRating);
				$('#coursePopularitySpan').text(arr[key].popularity);

				$('#courseBannerSpan').prepend('<img src="' + arr[key].courseBannerURL + '" />')
				break;
			}
			ctr++;
		}

		showCourseComments(courseId);
		initiateRatingObjects(courseId);
	});
		fireBoards.selectedCoursePage.removeAttribute('hidden');
		fireBoards.myFCPage.setAttribute('hidden', true);
	
}

function initiateRatingObjects(courseId) {
	addComment.setAttribute('onclick', 'pushComment("' + courseId + '")');
	star1.setAttribute('onclick', 'rateCourse("' + courseId + '", 1)');
	star2.setAttribute('onclick', 'rateCourse("' + courseId + '", 2)');
	star3.setAttribute('onclick', 'rateCourse("' + courseId + '", 3)');
	star4.setAttribute('onclick', 'rateCourse("' + courseId + '", 4)');
	star5.setAttribute('onclick', 'rateCourse("' + courseId + '", 5)');
	getMyRating(courseId);
}

function showCourseComments(courseId) {
	var commentsRef = firebase.database().ref('comments/' + courseId + '/messages').on('value', function(snapshot) {
		var objects = snapshot.val();
		//console.log("Show comments");
	    $('#commentsList').empty();
	    $('#selectedCommentsList').empty();
	    if (objects === null) {
	      $('#commentsList').append($('<li/>',{
	          html: '<p style="font-weight:700">No comments available yet for this course.'
	        }));
	      $('#selectedCommentsList').append($('<li/>',{
	          html: '<p style="font-weight:700">No comments available yet for this course.'
	        }));
	    } else {
	      for(var key in objects){
	      	var date = new Date(objects[key].commentDateTime);
	        $('#commentsList').append($('<li/>',{
	          html: '<i><br><span class="fa fa-quote-left" />&nbsp;&nbsp;' + objects[key].comment + '&nbsp;&nbsp;<span class="fa fa-quote-right" /><br>' + objects[key].userName + '<br>'+ formatDate(date) + '</i>'
	        }));
	        $('#selectedCommentsList').append($('<li/>',{
	          html: '<i><br><span class="fa fa-quote-left" />&nbsp;&nbsp;' + objects[key].comment + '&nbsp;&nbsp;<span class="fa fa-quote-right" /><br>' + objects[key].userName + '<br>'+ formatDate(date) + '</i>'
	        }));
	      }
	    }
	});
}

function pushComment(courseId) {
	if(commentsTextArea.value === null || commentsTextArea.value === "") {
		alert("Please input your comment for the course.");
	} else {
		var postData = {
			comment: commentsTextArea.value,
			commentDateTime: Date.now(),
			userName: firebase.auth().currentUser.displayName
		};

		var commentsRef = firebase.database().ref('comments/' + courseId + '/messages/').push(postData, snap => {
		   	alert('New comment posted!');
        	window.announcementForm.reset();
        	commentForm.reset();
		});
	}
}

function rateCourse(courseId, rate) {
	console.log("User rating: ", rate);
	var overallRate = 0;
	var count = 0;

	var coursesRef = firebase.database().ref('courseRating/' + courseId).once('value', function(snapshot) {
		console.log("DATABASE TRIGGERED: rateCourse");
		var objects = snapshot.val();

		if(objects == null) {
			console.log("===== FIRST RATING EVER");
			var courseRateRef = firebase.database().ref('courseRating/' + courseId + '/' + firebase.auth().currentUser.uid).update({
  			  rating: 0
  			});
		}
		else
		{
			count = 0;
			console.log("===== UPDATE RATING");
			for(var key in objects){
				console.log(key);
				overallRate += objects[key].rating;
				count++;
			}

			console.log("Overall rating: " + overallRate);
			console.log("Count: " + count);
			var newOverallRating = Math.floor(overallRate/count);
			console.log("New rating: " + newOverallRating);

			var rootRef = firebase.database().ref();

			var fcrootRef = rootRef.child('fireCourses').child(courseId).child('overallRating');
			var crootRef = rootRef.child('courseRating').child(courseId).child(firebase.auth().currentUser.uid).child('rating');
			var ucrootRef1 = rootRef.child('userCourses').child(firebase.auth().currentUser.uid).child(courseId).child('myRating');
			var ucrootRef2 = rootRef.child('userCourses').child(firebase.auth().currentUser.uid).child(courseId).child('overallRating');

			fcrootRef.transaction(function(currentRate) {
			   return newOverallRating;
			});

			crootRef.transaction(function(currentRate) {
			   return rate;
			});

			ucrootRef1.transaction(function(currentRate) {
			   return rate;
			});

			ucrootRef2.transaction(function(currentRate) {
			   return newOverallRating;
			});

			console.log("Overall Rating updated for " + courseId);
		}
		
		
	});

	 //    var updateRating = {};

	 //    updateRating['/fireCourses/' + courseId + '/overallRating'] = newOverallRating;
	 //    updateRating['/courseRating/' + courseId + '/' + firebase.auth().currentUser.uid + '/rating'] = rate;
		// updateRating['/userCourses/' + firebase.auth().currentUser.uid + '/' + courseId + '/myRating'] = rate;
		// updateRating['/userCourses/' + firebase.auth().currentUser.uid + '/' + courseId + '/overallRating'] = newOverallRating;

	 //  	var updates = rootRef.update(updateRating)
	 //  		.then(function (e){
	 //  			console.log("Overall Rating updated for " + courseId);
	 //  			alert("Rating of " + rate + " successful! Thanks!");
	 //  		})
	 //  		.catch(e => {
	 //  			console.log("Error: ", e.message());
	 //  			alert("Rating Failed. Please try again later.");
	 //  		});

	return;
}

function getMyRating(courseId) {
	var coursesRef = firebase.database().ref('userCourses/' + firebase.auth().currentUser.uid + '/' + courseId + '/myRating').on('value', function(snapshot) {
		if(snapshot.val() === "1") {
			star1.checked = true;
		} else if(snapshot.val() === "2") {
			star2.checked = true;
		} else if(snapshot.val() === "3") {
			star3.checked = true;
		} else if(snapshot.val() === "4") {
			star4.checked = true;
		} else if(snapshot.val() === "5") {
			star5.checked = true;
		}

	});
	console.log("Rating for " + courseId + "successfully retrieved.");
}

fireBoards.prototype.reportListCategories = function () {
	
	this.database.ref('/fireCourses/').on('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		
		$('#reportsCategorySel').empty();
		$('#reportsCategorySel').append($('<option selected value="">---Select Category---</option>'));
		for (var key in snapshot.val())
		{
			$('#reportsCategorySel').append($('<option value="' + key + '">' + arr[key].courseName + '</option>'));
		}
	});
}

fireBoards.prototype.reportGetCourse = function () {
	console.log("Report Get Course: " + reportsCategorySel.value);
	var filteredUsers = [];

	firebase.database().ref('/fireCourses/').on('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];

		for (var key in snapshot.val())
		{
			if (reportsCategorySel.value == key)
			{
				$('#reportCourseHeader').text(arr[key].courseName);
			}
		}
	});

	firebase.database().ref('/userCourses/').on('value', function (snapshot) {
		var arr = snapshot.val();
		var arr2 = Object.keys(arr);
		var key = arr2[0];
		var withUsers = false;

		$('#listOfUsersPerCategory').empty();

		for (var key in snapshot.val())
		{
			console.log(key);

			firebase.database().ref('/userCourses/' + key).on('value', function (snapshot) {
				var arr = snapshot.val();
				var arr2 = Object.keys(arr);
				var key = arr2[0];

				for (var key in snapshot.val())
				{
					if (reportsCategorySel.value == key)
					{
						userIsRegistered = true;
						break;
					}

					userIsRegistered = false;
				}
			});

			if (userIsRegistered)
			{
				console.log("User " + key + " is registered!");
				firebase.database().ref('/users/' + key).on('value', function (snapshot) {
					//filteredUsers.push
					console.log(snapshot.val().email);
					$('<p>').text(snapshot.val().email).appendTo($('#listOfUsersPerCategory'));
				});
				withUsers = true;
			}
			/*if (){
				filteredUsers.push(reportsCategorySel.value == )
			}
			console.log(arr[key].email);
			$('<p>').text(arr[key].email).appendTo($('#listOfUsersPerCategory'));*/
    	}

    	if(!withUsers) {
    		$('<p>').text("No registered users for this course yet.").appendTo($('#listOfUsersPerCategory'));
    	}
    });
}

fireBoards.prototype.openMaterial = function () {
	console.log(currentSelectedCourse);
	firebase.database().ref('/fireCourses/' + currentSelectedCourse).on('value', function(snapshot) {
		console.log(snapshot.val());
		window.open(snapshot.val().courseURL);
	});
}

fireBoards.prototype.tagCompleted = function () {

}

fireBoards.prototype.cancelRegistration = function () {
	console.log(currentSelectedCourse);
	
	var coursesRef = firebase.database().ref();
	var deletes = {};

    deletes['/userCourses/' + this.auth.currentUser.uid + '/' + currentSelectedCourse] = null;

	var delCourse = coursesRef.update(deletes).then(e => {
        alert("You have cancelled your registration");
        this.myFBShow();
      });

	var fireRef = firebase.database().ref('/fireCourses/' + currentSelectedCourse + '/popularity');
	fireRef.transaction(function(currentPopularity) {
	  return currentPopularity - 1;
	});

    console.log("User cancelled registration");
}

function deleteCourse (courseId, courseName, category) {
  var confirmDelete = confirm("Are you sure you want to delete this course?");

  if (confirmDelete) {
    var coursesRef = firebase.database().ref();
    var currentUserUid = firebase.auth().currentUser.uid;

    var deletes = {};

    deletes['/fireCourses/' + courseId] = null;

    var delCourse = coursesRef.update(deletes);
    console.log("Course deleted from database");

    var courseStorageRef = firebase.storage().ref('fireboards/' + category);
    courseStorageRef.child(courseName).delete()
      .then(e => {
        alert("Course has been removed from the database and cloud storage.");
      })
      .catch(e => {
        alert("Failed to remove course.");
        console.log("Error: " + e.message);
      });
  }
}

function deleteAnnouncement (announcementId) {
  var confirmDelete = confirm("Are you sure you want to delete this announcement?");
  
  if (confirmDelete) {
    var announceRef = firebase.database().ref();

    var deletes = {};

    deletes['/announcements/' + announcementId] = null;

    var deletePost = announceRef.update(deletes);
    alert("Post has been successfully removed.");
    console.log("Announcement deleted from database");
  }
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

window.onload = function() {
  window.fireBoards = new fireBoards();
};
