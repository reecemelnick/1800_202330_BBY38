
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

var listingLength = 0;
var length = 0;

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
                listingLength += 1;
                length += 1;
                var title = doc.data().name;
                var desc = doc.data().description;
                var type = doc.data().type;
                var edi = doc.data().edition;
                var condi = doc.data().condition;
                var listingCode = doc.data().code;
                var listingPrice = doc.data().price;
                var docID = doc.id;
                var timeStamp = doc.data().timestamp;
                let newcard = listingTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-price').innerHTML = "$" + listingPrice;
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

                newcard.querySelector('i').onclick = () => saveBookmark(docID);


                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        currentUser.get().then(userDoc => {


                            var bookmarks = userDoc.data().bookmarks;
                            if (bookmarks.includes(docID)) {
                                document.getElementById('save-' + docID).innerText = 'bookmark';
                            } else {
                                document.getElementById("save-" + docID).innerText = "bookmark_border";
                            }

                        });
                    }
                })

                document.getElementById(collection + "-go-here").appendChild(newcard);

            });
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

// Example: Call the function with the "listings" collection
displayListingsDynamically("listings");




function saveBookmark(listingDocID) {

    currentUser.get().then(userDoc => {
        let bookmarks = userDoc.data().bookmarks;
        let iconID = "save-" + listingDocID;
        let isBookmarked = bookmarks.includes(listingDocID);

        if (isBookmarked) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(listingDocID)
            }).then(() => {
                console.log("Bookmark removed for " + listingDocID);
                document.getElementById(iconID).innerText = "bookmark_border";
            });
        } else {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(listingDocID)
            }).then(function () {
                console.log("bookmark has been saved for" + listingDocID);
                document.getElementById(iconID).innerText = 'bookmark';
            });
        }
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





function sortAscending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortAscend(user)
            console.log(currentUser);

        }
    })
}

function sortAscend(user) {

    var priceArray = [];
    var idArray = [];
    var count = 0;

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var listingPrice = Number(doc.data().price);
                var flag = false;
                var docID = doc.id;

                for (let i = 0; i < priceArray.length; i++) {
                    if (listingPrice < priceArray[i]) {
                        var priceTemp = [];
                        var idTemp = [];
                        var flag2 = true;
                        for (let x = 0; x < priceArray.length; x++) {
                            if (x == i && flag2 == true) {
                                priceTemp.push(listingPrice);
                                idTemp.push(docID);
                                x -= 1;
                                flag2 = false;
                            } else {
                                priceTemp.push(priceArray[x]);
                                idTemp.push(idArray[x])
                            }
                        }
                        priceArray = priceTemp;
                        idArray = idTemp;
                        flag = true;
                        break;
                    }
                }

                if (flag == false) {
                    priceArray.push(listingPrice);
                    idArray.push(doc.id);
                }

                console.log(priceArray);
                console.log(idArray);

                if (count == listingLength) {
                    showCards(idArray);
                    console.log("heyhey");
                }
            })
        })
}


function sortDescending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortDescend(user)
            console.log(currentUser);

        }
    })
}

function sortDescend(user) {

    var priceArray = [];
    var idArray = [];
    var count = 0;

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var listingPrice = Number(doc.data().price);
                var flag = false;
                var docID = doc.id;

                for (let i = 0; i < priceArray.length; i++) {
                    if (listingPrice > priceArray[i]) {
                        var priceTemp = [];
                        var idTemp = [];
                        var flag2 = true;
                        for (let x = 0; x < priceArray.length; x++) {
                            if (x == i && flag2 == true) {
                                priceTemp.push(listingPrice);
                                idTemp.push(docID);
                                x -= 1;
                                flag2 = false;
                            } else {
                                priceTemp.push(priceArray[x]);
                                idTemp.push(idArray[x])
                            }
                        }
                        priceArray = priceTemp;
                        idArray = idTemp;
                        flag = true;
                        break;
                    }
                }

                if (flag == false) {
                    priceArray.push(listingPrice);
                    idArray.push(doc.id);
                }

                console.log(priceArray);
                console.log(idArray);

                if (count == listingLength) {
                    showCards(idArray);
                    console.log("heyhey");
                }
            })
        })
}


function sortGameType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortGame(user)
            console.log(currentUser);
        }
    })
}

function sortGame(user) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;
                
                if (type == "Game") {
                    Array.push(doc.id)
                }
               
                console.log(Array);
                if (count == listingLength) {
                    showCards(Array);
                    console.log("heyhey");
                }
            })
        })
}

function sortToyType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortToy(user)
            console.log(currentUser);
        }
    })
}

function sortToy(user) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;
                
                if (type == "Toy") {
                    Array.push(doc.id)
                }
               
                console.log(Array);
                if (count == listingLength) {
                    showCards(Array);
                    console.log("heyhey");
                }
            })
        })
}

function sortCardType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortCard(user)
            console.log(currentUser);
        }
    })
}

function sortCard(user) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;
                
                if (type == "Trading Card") {
                    Array.push(doc.id)
                }
               
                console.log(Array);
                if (count == listingLength) {
                    showCards(Array);
                    console.log("heyhey");
                }
            })
        })
}

function sortModelType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortModel(user)
            console.log(currentUser);
        }
    })
}

function sortModel(user) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;
                
                if (type == "Model") {
                    Array.push(doc.id)
                }
               
                console.log(Array);
                if (count == listingLength) {
                    showCards(Array);
                    console.log("heyhey");
                }
            })
        })
}

function sortOtherType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortOther(user)
            console.log(currentUser);
        }
    })
}

function sortOther(user) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;
                
                if (type == "Other") {
                    Array.push(doc.id)
                }
               
                console.log(Array);
                if (count == listingLength) {
                    showCards(Array);
                    console.log("heyhey");
                }
            })
        })
}

function showCards(array) {
    let listingTemplate = document.getElementById("listingCardTemplate");
    console.log(array);


    for (let x = 0; x < length; x++) {

        document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);
        console.log(x);

    }

    length = array.length;

    for (let i = 0; i < array.length; i++) {
        console.log("-------------");
        db.collection("listings").doc(array[i]).get().then(doc => {
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
            let newcard1 = listingTemplate.content.cloneNode(true);

            newcard1.querySelector('.card-title').innerHTML = title;
            newcard1.querySelector('.card-price').innerHTML = "$" + listingPrice;
            newcard1.querySelector('.card-text').innerHTML = details;

            newcard1.querySelector('.card-text').innerHTML = desc;
            newcard1.querySelector('.card-type').innerHTML = type;
            newcard1.querySelector('.card-edition').innerHTML = "Edition: " + edi;
            newcard1.querySelector('.card-condition').innerHTML = "Condition: " + condi;

            if (timeStamp) {
                newcard1.querySelector('.card-time').innerHTML = timeStamp.toDate();
            } else {
                newcard1.querySelector('.card-time').innerHTML = "Timestamp not available";
            }

            newcard1.querySelector('.card-image').src = `./images/${listingCode}.jpg`;

            newcard1.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

            newcard1.querySelector('i').onclick = () => saveBookmark(docID);

            document.getElementById("listings-go-here").appendChild(newcard1);

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser.get().then(userDoc => {


                        var bookmarks = userDoc.data().bookmarks;
                        if (bookmarks.includes(docID)) {
                            document.getElementById('save-' + docID).innerText = 'bookmark';
                        } else {
                            document.getElementById("save-" + docID).innerText = "bookmark_border";
                        }

                    });
                }
            })

        })
    }
}

