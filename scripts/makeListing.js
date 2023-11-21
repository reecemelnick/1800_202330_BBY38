var currentUser;               //points to the document of the user who is logged in
function checkLogIn() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
        } else {
            console.log("No user is signed in");
            window.location.href = "authenication.html";
        }
    })
}
checkLogIn();

var ImageFile;
function listenFileSelect() {
    // listen for file selection
    var fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    // When a change happens to the File Chooser Input
    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];   //Global variable
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; // Display this image
    })
}
listenFileSelect();

function makeListing() {
    let itemName = document.getElementById("name").value;
    let itemType = document.getElementById("type").value;
    let itemEdition = document.querySelector('input[name="edition"]:checked').value;
    let itemCondition = document.querySelector('input[name="condition"]:checked').value;
    let itemDescription = document.getElementById("description").value;
    let itemPrice = document.getElementById("price").value;


    // Get the document for the current user.
    db.collection("listings").add({
        // userID: userID,
        lister: currentUser,
        name: itemName,
        type: itemType,
        edition: itemEdition,
        condition: itemCondition,
        description: itemDescription,
        price: itemPrice,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(doc => {
        console.log("1. Post document added!");
                   console.log(doc.id);
        uploadPic(doc.id);
    });
    // } else {
    // console.log("No user is signed in");
    // window.location.href = 'makeListing.html';
    // }
};

function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    db.collection("listings").doc(postDocID).update({
                        image: url // Save the URL into users collection
                    })
                        // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                            // One last thing to do:
                            // save this postID into an array for the OWNER
                            // so we can show "my posts" in the future
                            savePostIDforUser(postDocID);
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

//--------------------------------------------
//saves the post ID for the user, in an array
//--------------------------------------------
function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("postdoc id is: " + postDocID);
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        })
            .then(() => {
                console.log("5. Saved to user's document!");
                window.location.href = "thanks.html"; // Redirect to the thanks page
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}
