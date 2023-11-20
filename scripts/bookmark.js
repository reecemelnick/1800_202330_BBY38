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

                        console.log("------");
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



function showCards(array) {
    let listingTemplate = document.getElementById("listingCardTemplate");
    console.log(array);
    
        
    for (let x = 0;x < array.length;x++) {
        
        document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);
        console.log(x);
        
    }
    
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

            console.log("bub");

            

            console.log("bubs");

            document.getElementById("listings-go-here").appendChild(newcard1);


            document.getElementById('save-' + docID).innerText = 'bookmark';

        })
    }
}