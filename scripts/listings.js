
// Function to add documents to the 'featured' collection
function addListing() {
    // Reference to the 'featured' collection
    var listingRef = db.collection('listings');

    // Add a document to the collection
    listingRef.add({
        code: "charizard",
        name: "Charizard",
        price: "18,000",
        details: "Good",
    })
        .then((docRef) => {
            console.log('Document written with ID:', docRef.id);
        })
        .catch((error) => {
            console.error('Error adding document:', error);
        });
}



var currentUser;


function displayListingsDynamically(collection) {
    let listingTemplate = document.getElementById("listingCardTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
        }
    })

    db.collection(collection).get()
        .then(allListings => {
            allListings.forEach(doc => {
                var title = doc.data().name;
                var details = doc.data().details;
                var listingCode = doc.data().code;
                var listingPrice = doc.data().price;
                var docID = doc.id;
                let newcard = listingTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-price').innerHTML = "$" + listingPrice;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${listingCode}.jpg`;

                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                document.getElementById(collection + "-go-here").appendChild(newcard);


                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }

                })

            });
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

// Example: Call the function with the "listings" collection
displayListingsDynamically("listings");



function saveBookmark(listingDocID) {
    // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
    currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(listingDocID)
    })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
            console.log("bookmark has been saved for" + listingDocID);
            var iconID = 'save-' + listingDocID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}