
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


function displayListingsDynamically(collection) {
    let listingTemplate = document.getElementById("listingCardTemplate");

    db.collection(collection).get()
        .then(allListings => {
            allListings.forEach(doc => {
                var title = doc.data().name;
                var desc = doc.data().description;
                var type = doc.data().type;
                var edi = doc.data().edition;
                var condi = doc.data().condition;
                var listingCode = doc.data().code;
                var listingPrice = doc.data().price;
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

                document.getElementById(collection + "-go-here").appendChild(newcard);
            });
        })
        .catch(error => {
            console.error("Error getting documents from Firestore:", error);
        });
}

// Example: Call the function with the "listings" collection
displayListingsDynamically("listings");

