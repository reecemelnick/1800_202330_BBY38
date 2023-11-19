function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}

doAll();


function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        console.log(userDoc.data().name)
        userName = userDoc.data().name;
        console.log(userName)
        document.getElementById("name-goes-here").innerHTML = userName;
    })

}

var currentUser;
function getBookmarks(user) {
    let listingTemplate = document.getElementById("listingCardTemplate");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);
        }
    })

    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var title = doc.data().name;
                        var details = doc.data().details;
                        var desc = doc.data().description;
                        var type = doc.data().type;
                        var edi = doc.data().edition;
                        var condi = doc.data().condition;
                        var timeStamp = doc.data().timestamp;
                        var listingCode = doc.data().code;
                        var listingPrice = doc.data().price;
                        var docID = doc.id;
                        let newcard = listingTemplate.content.cloneNode(true);

                        newcard.querySelector('.card-title').innerHTML = title;
                        newcard.querySelector('.card-price').innerHTML = "$" + listingPrice;
                        newcard.querySelector('.card-text').innerHTML = details;

                        newcard.querySelector('.card-text').innerHTML = desc;
                        newcard.querySelector('.card-type').innerHTML = type;
                        newcard.querySelector('.card-edition').innerHTML = "Edition: " + edi;
                        newcard.querySelector('.card-condition').innerHTML = "Condition: " + condi;

                        if (timeStamp) {
                            newcard.querySelector('.card-time').innerHTML = timeStamp.toDate();
                        } else {
                            newcard.querySelector('.card-time').innerHTML = "Timestamp not available";
                        }

                        newcard.querySelector('.card-image').src = `./images/${listingCode}.jpg`;

                        newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                        console.log();
                        document.getElementById("listings-go-here").appendChild(newcard);


                        currentUser.get().then(userDoc => {
                            //get the user name
                            var bookmarks = userDoc.data().bookmarks;
                            if (bookmarks.includes(docID)) {
                                document.getElementById('save-' + docID).innerText = 'bookmark';
                            }

                        })

                    });
                })
            } else {
                document.getElementById("listings-go-here").innerText("noBookmarks");

            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}


