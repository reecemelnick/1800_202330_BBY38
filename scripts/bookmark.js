var length = 0;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            getBookmarks(user);

        } else {
            document.getElementById("noListings").innerText = "No Bookmarks";
        }
    });
}

doAll();

document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);

function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {

        userName = userDoc.data().name;

        document.getElementById("name-goes-here").innerHTML = userName;
    })

}

var currentUser;
function getBookmarks(user) {
    let listingTemplate = document.getElementById("listingCardTemplate");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
        }
    })

    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;

            if (bookmarks.length != 0) {
                length = bookmarks.length;
                bookmarks.forEach(thisListingID => {

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

                        newcard.querySelector('i').id = 'save-' + docID;

                        newcard.querySelector('i').onclick = () => saveBookmark(docID);

                        document.getElementById("listings-go-here").appendChild(newcard);

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
                    });
                })
            } else {
                document.getElementById("noListings").value("No Bookmarks");
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

function sortAscending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortAscend(user);
        }
    })
}

function sortAscend(user) {

    var priceArray = [];

    var idArray = [];
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {
                        var listingPrice = Number(doc.data().price);

                        var flag = false;

                        for (let i = 0; i < priceArray.length; i++) {
                            if (listingPrice < priceArray[i]) {
                                var priceTemp = [];
                                var idTemp = [];
                                var flag2 = true;
                                for (let x = 0; x < priceArray.length; x++) {
                                    if (x == i && flag2 == true) {
                                        priceTemp.push(listingPrice);
                                        idTemp.push(thisListingID);
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
                            idArray.push(thisListingID);
                        }

                        if (idArray.length == bookmarks.length) {
                            showCards(idArray);
                        }
                    });
                })
            }
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}


function sortDescending() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortDescend(user);
        }
    })
}

function sortDescend(user) {

    var priceArray = [];

    var idArray = [];
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {

                    db.collection("listings").doc(thisListingID).get().then(doc => {
                        var listingPrice = Number(doc.data().price);

                        var flag = false;

                        for (let i = 0; i < priceArray.length; i++) {
                            if (listingPrice > priceArray[i]) {
                                var priceTemp = [];
                                var idTemp = [];
                                var flag2 = true;
                                for (let x = 0; x < priceArray.length; x++) {
                                    if (x == i && flag2 == true) {
                                        priceTemp.push(listingPrice);
                                        idTemp.push(thisListingID);
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
                            idArray.push(thisListingID);
                        }

                        if (idArray.length == bookmarks.length) {
                            showCards(idArray);
                        }
                    });
                })
            }
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}


function sortGameType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortType(user, "Game");
        }
    })
}


function sortToyType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortType(user, "Toy");
        }
    })
}


function sortCardType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortType(user, "Trading Card");
        }
    })
}


function sortModelType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortType(user, "Model");
        }
    })
}


function sortOtherType() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            sortType(user, "Other");
        }
    })
}


function sortType(user, typeCheck) {
    var Array = [];

    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);

                        if (type == typeCheck) {
                            Array.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(Array);
                        }
                    });
                })
            }

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
}