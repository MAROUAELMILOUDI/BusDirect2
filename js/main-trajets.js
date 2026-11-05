import { initialiser } from "./store.js";
import { renderTrips, handleFiltrer } from "./render.js";

async function demarrer() {
    const tripsData = await initialiser();
    renderTrips(tripsData, 1, 6);
    const villeInput = document.getElementById("ville");
    const statutSelect = document.getElementById("statut");
    if(villeInput){
        villeInput.addEventListener("input", handleFiltrer)
    } 
    if(statutSelect){
        statutSelect.addEventListener("change", handleFiltrer)
    }   
}
demarrer()

document.addEventListener("click", function(event){
    if(event.target.classList.contains("voir-cabin")){
        const id = event.target.dataset.id;
        location.href = `./cabin.html?id=${id}`;
    }
});