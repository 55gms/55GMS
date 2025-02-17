
function CopyToClipboard(arg)
{
    var tempInput = document.createElement("input");
    tempInput.setAttribute('value', arg);

    document.body.appendChild(tempInput);

    tempInput.select();

    document.execCommand("copy");

    document.body.removeChild(tempInput);    
}
