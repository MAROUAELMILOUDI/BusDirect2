import{ initialiser } from "./store.js";
import {estVIP, prixSiege} from "./reservations.js";


async function afficherCabin(){
    const urlParams = new URLSearchParams(location.search);
    const idParam = urlParams.get("id");
    if(!idParam){
        document.body.innerHTML = `<div class="p-8 text-center text-red-600 font-bold text-xl">Trajet introuvable</div>`;
        return;
    }
    const id = Number(idParam);
    const trips = await initialiser();
    const trip = trips.find(t => t.id === id);
    if(!trip){
        document.body.innerHTML = `<div class="p-8 text-center text-red-600 font-bold text-xl">Trajet introuvable</div>`;
        return;
    }
    const headerTitle = document.querySelector(".pageIntroduction p:nth-child(1)");
    if(headerTitle) headerTitle.textContent = `${trip.departure} → ${trip.destination}`;
    const headerTime = document.querySelector(".pageIntroduction p:nth-child(2)");
    if(headerTime) headerTime.textContent = `départ : ${trip.departureTime} | Arrivée : ${trip.arrivalTime}`;
    const headerPrice = document.querySelector("header .justify-self-end span");
    if(headerPrice) headerPrice.textContent = `${trip.price} DH / seat`; 

    const totalReservations = trip.reservations.length;
    const availableSeatsCount = trip.capacity - totalReservations;
    const totalRevenueAmount = trip.reservations.reduce(
        (somme, r) => somme + prixSiege(trip.price, Number(r.seat)), 0
    );

    const availableSeats = document.getElementById("availableSeats");
    if(availableSeats) availableSeats.textContent = availableSeatsCount;
    const totalRevenue = document.getElementById("totalRevenue");
    if(totalRevenue) totalRevenue.textContent = `${totalRevenueAmount} DH`;

    await afficheSiege(trip);
}
afficherCabin();

async function afficheSiege(trip){
    if(!trip || !trip.reservations) return;
    for(let num =1; num <= 20; num++ ){
        const article = document.getElementById(`place${num}`);
        if(!article) continue;

        const occupe = article.querySelector(".statut");
        const statutSpan = article.querySelector(".statut");
        const vip = estVIP(num);
        const reservation = trip.reservations.find(r => Number(r.seat) === num);

        if(vip){
            article.className = "Place flex h-16 min-w-0 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-[#FEEC41] bg-white text-[#FEEC41]";
            if(statutSpan){
                statutSpan.textContent = "VIP";
                statutSpan.className = "statut mt-1 text-[11px] text-[#5B6785]";
            }
        } else{
            article.className = "Place flex h-16 min-w-0 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-[#1D4BFF] bg-white text-[#1D4BFF]";
            if(statutSpan){
                statutSpan.textContent = "Libre";
                statutSpan.className = "statut mt-1 text-[11px] text-[#5B6785]";
            }
        }

        if(occupe && statutSpan){
            if(vip){
                article.classList.remove("bg-white", "text-[#FEEC41]");
                article.classList.add("bg-[#FEEC41]/30", "text-[#0F1B3D]");
                statutSpan.textContent = reservation.name;
                statutSpan.classList.remove("text-[#5B6785]");
                statutSpan.classList.add("truncate", "text-[#0F1B3D]", "font-semibold");
            } else{
                article.classList.remove("bg-white", "border-[#1D4BFF]", "text-[#1D4BFF]");
                article.classList.add("bg-[#1D4BFF]", "border-[#1D4BFF]", "text-white");
                statutSpan.textContent = reservation.name;
                statutSpan.classList.remove("text-gray-500", "text-[#1D4BFF]");
                statutSpan.classList.add("truncate", "maw-w-full", "text-white");
            }
        }
    }
}