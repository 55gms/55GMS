window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = '';
});
/* this script prevents the goguardian scene from automatically closing this to the "Hey there! you're teacher doesn't want you to browse right now." message popup
/*, which means the user can still use this website without any issue.
