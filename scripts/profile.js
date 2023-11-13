var currentUser;               //points to the document of the user who is logged in
function UserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userAddress = userDoc.data().address;
                    var userCity = userDoc.data().city;
                    var userInterests = userDoc.data().interests;
                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                        document.getElementById("names").innerText = userName;
                        
                    }
                    if (userAddress != null) {
                        document.getElementById("addressInput").value = userAddress;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userInterests != null) {
                        document.getElementById("interests").value = userInterests;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
UserInfo();

function editUserInfo() {
    window.location.assign("createProfile.html");
}