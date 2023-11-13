function makeListing() {
    let itemName = document.getElementById("name").value;
    let itemType = document.getElementById("type").value;
    let itemEdition = document.querySelector('input[name="edition"]:checked').value;
    let itemCondition = document.querySelector('input[name="condition"]:checked').value;
    let itemDescription = document.getElementById("description").value;
    let itemPrice = document.getElementById("price").value;
    

    var user = firebase.auth().currentUser;
    // if (user) {
        // var currentUser = db.collection("users").doc(user.uid);
        // var userID = user.uid;

        // Get the document for the current user.
        db.collection("listings").add({
            // userID: userID,
            name: itemName,
            type: itemType,
            edition: itemEdition,
            condition: itemCondition,
            description: itemDescription,
            price: itemPrice,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    // } else {
        // console.log("No user is signed in");
        // window.location.href = 'makeListing.html';
    // }
}