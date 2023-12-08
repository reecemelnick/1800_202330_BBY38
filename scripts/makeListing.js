var currentUser;
function checkLogIn() {
    firebase.auth().onAuthStateChanged(user => {

        if (user) {
            currentUser = db.collection("users").doc(user.uid)
        } else {
            window.location.href = "authentication.html";
        }
    })
}
checkLogIn();

var ImageFile;
function listenFileSelect() {
    var fileInput = document.getElementById("mypic-input");
    const image = document.getElementById("mypic-goes-here");

    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob;
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

    db.collection("listings").add({
        lister: currentUser,
        name: itemName,
        type: itemType,
        edition: itemEdition,
        condition: itemCondition,
        description: itemDescription,
        price: itemPrice,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(doc => {
        uploadPic(doc.id);
    });
};

function uploadPic(postDocID) {
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)
        .then(function () {

            storageRef.getDownloadURL()

                .then(function (url) {

                    db.collection("listings").doc(postDocID).update({
                        image: url // Save the URL into users collection
                    })
                        .then(function () {
                            savePostIDforUser(postDocID);
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {

        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        })
            .then(() => {
                window.location.href = "thanks.html";
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}
