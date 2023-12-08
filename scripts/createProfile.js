var currentUser;
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {

        if (user) {

            currentUser = db.collection("users").doc(user.uid)

            currentUser.get()
                .then(userDoc => {

                    var userName = userDoc.data().name;
                    var userAddress = userDoc.data().address;
                    var userCity = userDoc.data().city;
                    var userInterests = userDoc.data().interests;

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
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

var ImageFile;

function chooseFileListener() {
    const fileInput = document.getElementById("mypic-input");
    const image = document.getElementById("mypic-goes-here");

    fileInput.addEventListener('change', function (e) {

        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        image.src = blob;
    })
}
chooseFileListener();

function saveUserInfo() {

    firebase.auth().onAuthStateChanged(function (user) {
        var storageRef = storage.ref("images/" + user.uid + ".jpg");

        storageRef.put(ImageFile)
            .then(function () {

                storageRef.getDownloadURL()
                    .then(function (url) {

                        userName = document.getElementById('nameInput').value;
                        userAddress = document.getElementById('addressInput').value;
                        userCity = document.getElementById('cityInput').value;
                        userInterests = document.getElementById('interests').value;

                        currentUser.update({
                            name: userName,
                            address: userAddress,
                            city: userCity,
                            interests: userInterests,
                            profilePic: url
                        })
                            .then(() => {
                                window.location.assign("profile.html");
                            })
                    })
            })
    })
}