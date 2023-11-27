
var length = 3;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //insertNameFromFirestore(user);
            getBookmarks(user)

        } else {
            console.log("hehe");
            document.getElementById("noListings").innerText = "No Bookmarks";
            console.log("No user is signed in");
        }
    });
}

doAll();

document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);

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
                length = bookmarks.length;
                bookmarks.forEach(thisListingID => {
                    //console.log(thisListingID);

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

                        newcard.querySelector('i').onclick = () => saveBookmark(docID);

                        console.log("------");
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
                console.log("hehe");
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
            sortAscend(user)
            console.log(currentUser);

        }
    })
}

function sortAscend(user) {

    var priceArray = [];
    //priceArray.push(10);
    var idArray = [];
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {
                        var listingPrice = Number(doc.data().price);
                        console.log(listingPrice);
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
                        //priceArray.push(listingPrice);
                        if (flag == false) {
                            priceArray.push(listingPrice);
                            idArray.push(thisListingID);
                        }
                        console.log(priceArray);
                        console.log(idArray);
                        if (idArray.length == bookmarks.length) {
                            showCards(idArray);
                            console.log("heyhey");
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
            sortDescend(user)
            console.log(currentUser);

        }
    })
}

function sortDescend(user) {

    var priceArray = [];
    //priceArray.push(10);
    var idArray = [];
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {
                        var listingPrice = Number(doc.data().price);
                        console.log(listingPrice);
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
                        //priceArray.push(listingPrice);
                        if (flag == false) {
                            priceArray.push(listingPrice);
                            idArray.push(thisListingID);
                        }
                        console.log(priceArray);
                        console.log(idArray);
                        if (idArray.length == bookmarks.length) {
                            showCards(idArray);
                            console.log("heyhey");
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
            sortGame(user)
            console.log(currentUser);
        }
    })
}

function sortGame(user) {
    var gameArray = [];
    //priceArray.push(10);
    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);
                        console.log(type);

                        if (type == "Game") {
                            gameArray.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(gameArray);
                        }
                    });
                })
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
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
    var toyArray = [];
    //priceArray.push(10);
    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);
                        console.log(type);

                        if (type == "Toy") {
                            toyArray.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(toyArray);
                        }
                    });
                })
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
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
    var cardArray = [];
    //priceArray.push(10);
    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);
                        console.log(type);

                        if (type == "Trading Card") {
                            cardArray.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(cardArray);
                        }
                    });
                })
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
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
    var modelArray = [];
    //priceArray.push(10);
    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);
                        console.log(type);

                        if (type == "Model") {
                            modelArray.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(modelArray);
                        }
                    });
                })
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
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
    var otherArray = [];
    //priceArray.push(10);
    var count = 0;
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {

            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            if (bookmarks.length != 0) {
                bookmarks.forEach(thisListingID => {
                    console.log(thisListingID);

                    db.collection("listings").doc(thisListingID).get().then(doc => {

                        var type = (doc.data().type);
                        console.log(type);

                        if (type == "Other") {
                            otherArray.push(thisListingID)
                        }

                        count += 1;
                        if (count == bookmarks.length) {
                            showCards(otherArray);
                        }
                    });
                })
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
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

}