function displayHikeInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
   
   
    db.collection( "listings" )
        .doc( ID )
        .get()
        .then( doc => {
            thisListing = doc.data();
            listingPrice = doc.data().price;
            listingCode = doc.data().code;
            listingName = doc.data().name;
            
           

            // only populate title, and image
            document.getElementById( "listingName" ).innerHTML = "Item information: " + "<br>" +  "<br>" + listingName + " $" + listingPrice; 

           
        } );
}
displayHikeInfo();


// function saveHikeDocumentIDAndRedirect(){
//     let params = new URL(window.location.href) //get the url from the search bar
//     let ID = params.searchParams.get("docID");
//     localStorage.setItem('listingDocID', ID);
//     window.location.href = 'viewListing.html';
// }

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
// const stars = document.querySelectorAll('.star');

// // Iterate through each star element
// stars.forEach((star, index) => {
//     // Add a click event listener to the current star
//     star.addEventListener('click', () => {
//         // Fill in clicked star and stars before it
//         for (let i = 0; i <= index; i++) {
//             // Change the text content of stars to 'star' (filled)
//             document.getElementById(`star${i + 1}`).textContent = 'star';
//         }
//     });
// });