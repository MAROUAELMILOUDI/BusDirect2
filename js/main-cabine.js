const places = document.querySelectorAll(".Place");

const inputNom = document.getElementById("reserver-nom");
const siege = document.getElementById("reserver-siege");
const btnreservation = document.getElementById("reservbtn");

const deltReserve = document.getElementById("supprimer-reservation");
const deltbtn = document.getElementById("suppressionbtn");

const modifierResv = document.getElementById("modifier-reservation");
const modifierNom = document.getElementById("modifier-nom");
const modifierSiege = document.getElementById("modifier-siege");
const modifierBtn = document.getElementById("modifierbtn");
 
const notification = document.getElementById('notification');

function sauvegarder(){
    localStorage.setItem("reservations", JSON.stringify(reservations))
}
function getItem(){
    const donnees = localStorage.getItem("reservations")
    if(donnees !== null){
        reservations = JSON.parse(donnees)
    }
}

let reservations = [];
let timer;

// for (let i = 0; i < places.length; i++) {
//     const numero = places[i].querySelector(".numero").textContent.trim();
//     const nom = places[i].querySelector(".statut").textContent.trim();
//     if (nom !== "Libre") {
//         reservations.push({
//             siege: numero,
//             nom: nom
//         });
//     }
// }

function statistiques(){
    const placesDispo = document.getElementById('availableSeats');
    const prixTotal = document.getElementById('totalRevenue');
    let places = 20;
    let total = 0;
    for(let i=0; i < reservations.length; i++){
        places -= 1;
        total += 80;
    }
    placesDispo.textContent = places;
    prixTotal.textContent = total + 'DH'
}

function afficherNotification(message, type) { 
    clearTimeout(timer);
    notification.textContent = message;
    notification.classList.remove("hidden", "bg-green-100", "text-green-800", "bg-red-100", "text-red-800");
    if (type === "succes"){
        notification.classList.add("bg-green-100", "text-green-800");
    } else if (type === "erreur") {
        notification.classList.add("bg-red-100", "text-red-800");
    }
    timer = setTimeout(function () {
        notification.classList.add("hidden");
    }, 3000);
}

function remplirSieges() {
    siege.innerHTML = "<option value='auto'>Attribution automatique</option>";
    for (let i = 0; i < places.length; i++) {
        const numero = places[i].querySelector(".numero").textContent.trim();
        const etat = places[i].querySelector(".statut").textContent.trim();
        if (etat === "Libre") {
            siege.innerHTML += "<option value='" + numero + "'>Siège " + numero + "</option>";
        }
    }
    sauvegarder();
    statistiques();
    
}

remplirSieges();

btnreservation.addEventListener("click", function (event) {
    event.preventDefault()
    const nomValeur = inputNom.value.trim();
    let numeroChoisi = siege.value;
    if (nomValeur === "") {
        afficherNotification("Entrez le nom du passager", "erreur");
        return;
    }
    if (numeroChoisi === "auto") {
        let trouve = false;
        for (let i = 0; i < places.length; i++) {
            if (places[i].querySelector(".statut").textContent.trim() === "Libre") {
                numeroChoisi = places[i].querySelector(".numero").textContent.trim();
                trouve = true;
                break;
            }
        }
        if (!trouve) {
            afficherNotification("Le bus est complet", "erreur");
            return;
        }
    } 
    for (let i = 0; i < places.length; i++) {
        const numero = places[i].querySelector(".numero").textContent.trim();
        const statut = places[i].querySelector(".statut");

        if (numero === numeroChoisi) {
            if (statut.textContent.trim() !== "Libre") {
                afficherNotification("Ce siège est déjà réservé", "erreur");
                return;
            }
            places[i].classList.remove("bg-white", "border-[#1D4BFF]", "text-[#1D4BFF]");
            places[i].classList.add("bg-[#1D4BFF]", "border-[#1D4BFF]", "text-white");

            statut.textContent = nomValeur;
            statut.classList.remove("text-gray-500", "text-[#1D4BFF]");
            statut.classList.add("truncate", "text-white");
            reservations.push({
                siege: numeroChoisi,
                nom: nomValeur
            })

            sauvegarder();
            afficherNotification("Siége " + numeroChoisi + " réservé pour " + nomValeur, "succes");
            break;
        }
    } 
    inputNom.value = "";
    remplirSieges();
    deltSiege();
    modifierList()
});


function deltSiege() {
    deltReserve.innerHTML = "<option value=''>Choisir un siège</option>";
    for (let i = 0; i < places.length; i++) {
        const numero = places[i].querySelector(".numero").textContent.trim();
        const etat = places[i].querySelector(".statut").textContent.trim();
        if (etat !== "Libre") {
            deltReserve.innerHTML += "<option value='" + numero + "'>Siège " + numero + " (" + etat + ")</option>";
        }
    }
    sauvegarder();
    statistiques();
    
}
deltSiege()

deltbtn.addEventListener("click", function (event) {
    event.preventDefault()
    const numeroChoisi = deltReserve.value;
    if (numeroChoisi === "") {
        afficherNotification("choisisser un siège a supprimer", "erreur");
        return;
    }
    for(let i=0; i<places.length; i++){
        const numero = places[i].querySelector('.numero').textContent.trim();
        const etat = places[i].querySelector('.statut');
        if (numeroChoisi === numero){
            places[i].classList.remove("bg-[#1D4BFF]", "text-white");
            places[i].classList.add("bg-white", "border-[#1D4BFF]", "text-[#1D4BFF]");

            etat.textContent = "Libre";
            etat.classList.remove("truncate", "text-white");
            etat.classList.add('text-gray-500');
            for(let j=0; j<reservations.length; j++){
                if(reservations[j].siege === numeroChoisi){
                    reservations.splice(j, 1);
                    break;
                }
            }
            afficherNotification("Reservation du siège " + numeroChoisi + " supprimée", "succes");
            break;
        }
    }
    remplirSieges();
    deltSiege();
    modifierList();
});

function modifierList() {
    modifierResv.innerHTML = "<option value=''>Choisir une réservation</option>"
    for(let i=0; i<reservations.length; i++){
        modifierResv.innerHTML+= "<option value='" + reservations[i].siege + "'>Siège " + reservations[i].siege + " ( " + reservations[i].nom + " )</option>";
    } 
    modifierSiege.innerHTML = "<option value=''>Choisir un siège</option>";
    for (let i = 0; i < places.length; i++) {
        const numero = places[i].querySelector(".numero").textContent.trim();
        const etat = places[i].querySelector(".statut").textContent.trim();
        if (etat === "Libre") {
            modifierSiege.innerHTML += "<option value='" + numero + "'>" + numero + "</option>";

        }
    }
    sauvegarder();
}
modifierList();

modifierBtn.addEventListener("click", function (event){
    event.preventDefault()
    const numeroChoisi = modifierResv.value;
    const newSiege = modifierSiege.value;
    const newName = modifierNom.value.trim();
    if (numeroChoisi === "") {
        afficherNotification("choisisser un siège a modifier", "erreur");
        return;
    }
    if (newName === "" && newSiege === "") {
        afficherNotification("choisisser un nom a modifier", "erreur");
        return;
    }
    let reservation = null;
    for(let i=0; i<reservations.length; i++){
        if(reservations[i].siege === numeroChoisi){
            reservation = reservations[i];
            break
        }
    }
    if(reservation === null){
        afficherNotification('Réservation introuvable', "erreur")
        return
    }
    let nomFinal = reservation.nom;
    let siegeFinal = reservation.siege;
    if(newName !== ""){
        nomFinal = newName
    }
    if(newSiege !== ""){
        siegeFinal = newSiege
    }
    let ancienPlace = null;
    let nouveauPlace = null;
    for(let i=0; i<places.length; i++){
        const numero = places[i].querySelector(".numero").textContent.trim()
        if(numero === reservation.siege){
            ancienPlace = places[i]
        }
        if(numero === siegeFinal){
            nouveauPlace = places[i]
        }
    }
    if(nouveauPlace === null || ancienPlace === null){
        afficherNotification("siège introuvable", "erreur")
        return
    }
    if(siegeFinal !== reservation.siege && nouveauPlace.querySelector(".statut").textContent.trim() !== "Libre"){
        afficherNotification("Ce siège est déja réservé", "erreur")
        return
    }
    if(siegeFinal !== reservation.siege){
        const ancienStatut = ancienPlace.querySelector(".statut")
        ancienStatut.textContent = "Libre"
        ancienStatut.classList.remove("truncate", "text-white")
        ancienStatut.classList.add("text-gray-500")
        ancienPlace.classList.remove("bg-[#1D4BFF]", "text-white")
        ancienPlace.classList.add("bg-white", "border-[#1D4BFF]", "text-[#1D4BFF]")

        const nouveauStatut = nouveauPlace.querySelector(".statut")
        nouveauStatut.textContent = nomFinal
        nouveauStatut.classList.remove("text-gray-500", "text-[#1D4BFF]")
        nouveauStatut.classList.add("truncate", "text-white")
        nouveauPlace.classList.remove("bg-white", "text-[#1D4BFF]")
        nouveauPlace.classList.add("bg-[#1D4BFF]", "border-[#1D4BFF]", "text-white")
    }else{
        const statut = ancienPlace.querySelector(".statut")
        statut.textContent=nomFinal;
        statut.classList.add("truncate", "text-white")
    }
    reservation.nom = nomFinal;
    reservation.siege = siegeFinal;
    sauvegarder()
    afficherNotification("Modification effectuée avec succès", "succes")
    modifierNom.value=""
    remplirSieges()
    deltSiege()
    modifierList()
})
 
function afficherReservation(){
    for(let i=0; i<reservations.length; i++){
        for(let j=0; j<places.length; j++){
            const numero = places[j].querySelectorAll(".numero").textContent.trim()
            if(numero === reservations[i].siege){
                const statut = places[j].querySelector(".statut")
                statut.textContent = reservations[i].nom
                statut.classList.remove("text-gray-500", "text-[#1D4BFF]")
                statut.classList.add("truncate", "text-white")
                places[j].classList.remove("bg-white", "text-[#1D4BFF]")
                places[j].classList.add("bg-[#1D4BFF]", "border-[#1D4BFF]", "text-white")
            }    
        }
    }
}

getItem();
afficherReservation();
remplirSieges();
deltSiege();
modifierList();



