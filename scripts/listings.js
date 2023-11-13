
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
                var details = doc.data().details;
                var listingCode = doc.data().code;
                var listingPrice = doc.data().price;
                let newcard = listingTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-price').innerHTML = "$" + listingPrice;
                newcard.querySelector('.card-text').innerHTML = details;
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

