window.addEventListener("load", () => {

window.scrollTo(0,0);

if(window.location.hash){

history.replaceState(null,null,window.location.pathname);

}

});

document.addEventListener("contextmenu", function(e){
e.preventDefault();
});
