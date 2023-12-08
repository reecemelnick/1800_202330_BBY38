function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log($('#navbarPlaceholder').load('./text/navAfterLogin.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        } else {
            console.log($('#navbarPlaceholder').load('./text/navBeforeLogin.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        }
    });
}
loadSkeleton(); 