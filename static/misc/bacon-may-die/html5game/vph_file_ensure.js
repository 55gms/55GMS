///
function file_ensure_js(path, content) {
    try {
        if (localStorage.getItem(path) == null) {
            localStorage.setItem(path, content);
            return 1;                
        }
    } catch (e) {
        console.log(e);
    }
    return 0;
}