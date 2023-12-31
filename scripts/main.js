function displayListingsDynamically(collection) {
    let listingTemplate = document.getElementById("featuredCardTemplate");
    let listingsContainer = document.getElementById(collection + "-go-here");

    listingsContainer.innerHTML = '';

    db.collection(collection).limit(1).get()
        .then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
                let doc = querySnapshot.docs[0];
                var title = doc.data().name;
                var desc = doc.data().description;
                var type = doc.data().type;
                var edi = doc.data().edition;
                var condi = doc.data().condition;
                var listingCode = doc.data().code;
                var listingPrice = doc.data().price;
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

                listingsContainer.appendChild(newcard);
            } else {
                console.log("No listings found.");
            }
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

displayListingsDynamically("listings");
