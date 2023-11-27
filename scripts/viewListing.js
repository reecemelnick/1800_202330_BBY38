// viewListing.js

function displayListingDetails(listingDocID) {
    // Fetch and display details for the specified listing ID
    db.collection('listings').doc(listingDocID).get()
        .then(doc => {
            if (doc.exists) {
                // Document exists, display details
                // Update HTML elements with the details from the document
            } else {
                // Document doesn't exist
                console.error("No such document");
            }
        })
        .catch(error => {
            console.error('Error getting document:', error);
        });
}

// Get the listingDocID from the URL
const urlParams = new URLSearchParams(window.location.search);
const listingDocID = urlParams.get('id');

// Call the function when the page loads
displayListingDetails(listingDocID); // Ensure that listingDocID is obtained from the URL
