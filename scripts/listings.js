function addListing() {
    var listingRef = db.collection('listings');

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
            currentUser = db.collection("users").doc(user.uid);
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
                var img = doc.data().image;
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
                if (img) {
                    newcard.querySelector('.card-image').src = img;
                } else {
                    newcard.querySelector('.card-image').src = "images/CollecTraders.png";
                }
                newcard.querySelector('a').href = "viewListing.html?docID=" + docID;

                newcard.querySelector('i').id = 'save-' + docID;

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
                document.getElementById(iconID).innerText = "bookmark_border";
            });
        } else {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(listingDocID)
            }).then(function () {
                document.getElementById(iconID).innerText = 'bookmark';
            });
        }
    })
        .then(function () {
            var iconID = 'save-' + listingDocID;
            document.getElementById(iconID).innerText = 'bookmark';
        });
}


function sortAscending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortAscend(user)
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

                if (count == listingLength) {
                    showCards(idArray);
                }
            })
        })
}


function sortDescending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortDescend(user)
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

                if (count == listingLength) {
                    showCards(idArray);
                }
            })
        })
}


function sortGameType() {
    sortType("Game");
}


function sortToyType() {
    sortType("Toy");
}


function sortCardType() {
    sortType("Trading Card");
}


function sortModelType() {
    sortType("Model");
}


function sortOtherType() {
    sortType("Other");
}


function sortType(typeCheck) {
    var count = 0;
    var Array = [];

    db.collection("listings").get()
        .then(allListings => {
            allListings.forEach(doc => {
                count += 1;
                var type = (doc.data().type);
                var docID = doc.id;

                if (type == typeCheck) {
                    Array.push(doc.id)
                }

                if (count == listingLength) {
                    showCards(Array);
                }
            })
        })
}


function showCards(array) {
    let listingTemplate = document.getElementById("listingCardTemplate");

    for (let x = 0; x < length; x++) {

        document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);

    }

    length = array.length;

    for (let i = 0; i < array.length; i++) {

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
            var img = doc.data().image;
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

            if (img) {
                newcard1.querySelector('.card-image').innerHTML = img;
            } else {
                newcard1.querySelector('.card-image').innerHTML = "images/CollecTraders.png";
            }

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

