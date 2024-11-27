function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module)
    return;
  if (!gameInstance.logo)
  {
    gameInstance.logo = document.getElementById("custom-logo");
    gameInstance.logo.style.display = "block";
    gameInstance.container.appendChild(gameInstance.logo);
  }
 if (!gameInstance.progress)
  {
    gameInstance.progress = document.getElementById("custom-loader");
    gameInstance.progress.style.display = "block";
    gameInstance.container.appendChild(gameInstance.progress);
  }

  

  if (progress == 1)
  {
    gameInstance.logo.style.display = "none";
    gameInstance.progress.style.display = "none";
  }
  else{
	  setLoaderProgressTo(progress);
  }
}

// value - 0 to 1
function setLoaderProgressTo(value)
{
  const fill = gameInstance.progress.getElementsByClassName("fill")[0];
  const fillText = gameInstance.progress.getElementsByClassName("label")[0];

 var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
 
}
else{
	fill.animate(
    [
      { width: (value * 100) + "%" }
    ],
    {
      duration: 300,
      fill: "forwards"
    }
  );
}

  fillText.textContent = (value * 100).toFixed() + "%";
}