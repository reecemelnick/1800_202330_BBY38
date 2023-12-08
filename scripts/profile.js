var currentUser;
function UserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            currentUser = db.collection("users").doc(user.uid)

            currentUser.get()
                .then(userDoc => {

                    var userName = userDoc.data().name;
                    var userAddress = userDoc.data().address;
                    var userCity = userDoc.data().city;
                    var userInterests = userDoc.data().interests;
                    var profilePic = userDoc.data().profilePic;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userAddress != null) {
                        document.getElementById("addressInput").value = userAddress;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userInterests != null) {
                        document.getElementById("interests").value = userInterests;
                    }
                    if (profilePic != null) {
                        $("#mypic-goes-here").attr("src", profilePic);
                    } else {
                        $("#mypic-goes-here").attr("src", "images/no-image-profile.jpg")
                    }
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

UserInfo();

function editUserInfo() {
    window.location.assign("createProfile.html");
}

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            getOwnPosts(user)
        } else {
            document.getElementById("noListings").innerText = "No Bookmarks";
        }
    });
}

doAll()
document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);

var lengths = 0;
var currentUser;
function getOwnPosts(user) {
    for (let x = 0; x < lengths; x++) {

        document.getElementById("listings-go-here").removeChild(document.getElementById("listings-go-here").firstElementChild);

    }

    let listingTemplate = document.getElementById("listingCardTemplate");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
        }
    })

    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            var myposts = userDoc.data().myposts;

            lengths = myposts.length;

            if (myposts.length != 0) {

                myposts.forEach(thisListingID => {

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

                        newcard.querySelector('strong').onclick = () => deletePost(docID);

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
                document.getElementById("noListings").value("No posts");
            }

        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

function deletePost(listingid) {
    var result = confirm("Want to delete? This will mean that this listing will be removed from the database and no one else will be able to see it.");
    if (result) {
        db.collection("listings").doc(listingid)
            .delete()
            .then(() => {
                deleteFromMyPosts(listingid);
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}


function deleteFromMyPosts(postid) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayRemove(postid)
        })
            .then(() => {

                deleteFromSaves(postid);

                doAll();

            })
    })
}

function deleteFromSaves(listingid) {

    db.collection("users").get()
        .then(allUsers => {
            allUsers.forEach(userDoc => {

                var bookmarks = userDoc.data().bookmarks;

                if (bookmarks.length != 0) {
                    let bookmarks = userDoc.data().bookmarks;
                    let isBookmarked = bookmarks.includes(listingid);


                    if (isBookmarked) {
                        currentUser.update({
                            bookmarks: firebase.firestore.FieldValue.arrayRemove(listingid)
                        })
                    }
                }
            })
        })

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