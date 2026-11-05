import { trips } from "./store.js";
export function renderTrips(modifiedTrips, page,size){
    const trajets = document.getElementById("trajets");
    trajets.innerHTML ="";
    const safeTrips = modifiedTrips || [];
    if(safeTrips.length === 0){
        trajets.innerHTML=`
        <div class="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow text-center">
            <i class="fa fa-ban text-4xl text-gray-400 mb-2"></i>
            <p class="text-base font-semibold text-gray-700">Aucun résultat trouvé</p>
            <p class="text-sm text-gray-500 mt-1">Il y'a aucun trajet qui renssemble a ton recherch</p>
        </div>`;
        const paginationHTML = document.getElementById("pagination");
        if(paginationHTML){
            paginationHTML.innerHTML = "";
        }
        return;
    }
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const selecteTrips = safeTrips.slice(startIndex, endIndex);
    selecteTrips.forEach((trip) => {
        let card = document.createElement("div");
        card.className = `bg-white rounded-xl p-4 shadow flex flex-col gap-3`;
        card.innerHTML = `
        <div class="flex items-center justify-between gap-3">
            <div>
                <p class="text-xs text-gray-500">${trip.departure} → ${trip.destination}</p>
                <p class="text-sm font-bold text-gray-800 mt-0.5"><i class="fa-regular fa-clock text-xs mr-1 text-gray-400"></i>${trip.departureTime} → ${trip.arrivalTime}</p>
            </div>
            <span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${trip.capacity === trip.reservations.length ? "bg-red-200 text-red-600" : "bg-green-200 text-green-600"}">
                ${trip.capacity === trip.reservations.length ? "Complet" : "Disponible"}
            </span>
        </div>
        <div class="flex items-center justify-between">
            <p class="font-semibold text-sm">${trip.price} DH</p>
            <button class="voir-cabin border border-cyan-500 text-cyan-500 rounded-lg px-3 py-1 text-sm hover:bg-blue-100" data-id="${trip.id}">Voir la cabin</button>
        </div>`;
        trajets.appendChild(card);      
    });
    renderPagination(safeTrips, page, size)
}

export function handleFiltrer(e){
    const searchVille = document.getElementById("ville");
    const statutSelector = document.getElementById("statut");
    const city = searchVille.value.toLowerCase().trim();
    const statut = statutSelector.value;
    const filtredTrips = trips.filter((trip) => {
        const matchCity = trip.departure.toLowerCase().includes(city) || trip.destination.toLowerCase().includes(city);
        let matchFiltrer = false;
        if(statut === "tout"){
            matchFiltrer = true;
        }
        if(statut === "disponible"){
            matchFiltrer = trip.capacity > trip.reservations.length;
        }
        if(statut === "complet"){
            matchFiltrer = trip.capacity === trip.reservations.length;
        }
        return matchCity && matchFiltrer;
    });
    renderTrips(filtredTrips, 1, 6)
}

export function renderPagination(modifiedTrips, courantPage, pageSize){
    const paginationHTML = document.getElementById("pagination");
    paginationHTML.innerHTML = "";
    const totalPages = Math.ceil(modifiedTrips.length / pageSize);
    if(totalPages <= 1){
        return;
    }
    if(courantPage > 1){
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = "&lt;";
        prevBtn.className = "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black font-semibold";
        prevBtn.addEventListener("click", () => {
            renderTrips(modifiedTrips, courantPage - 1, pageSize)
        });
        paginationHTML.appendChild(prevBtn);
    }
    for(let i = 1; i<=totalPages; i++){
        const btn = document.createElement("button");
        btn.innerText = i;
        if(i === courantPage){
            btn.className = "rounded-[12px] px-4 py-2 bg-[#0C1E4A]/40 text-white font-semibold";
        } else{
            btn.className = "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black";
        }
        btn.addEventListener("click", () => {
            renderTrips(modifiedTrips, i, pageSize);
        });
        paginationHTML.appendChild(btn);
    }
    if(courantPage < totalPages){
        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = "&gt;";
        nextBtn.className = "hover:cursor-pointer rounded-[12px] px-4 py-2 bg-[#E7E5E4] text-black font-semibold";
        nextBtn.addEventListener("click", () => {
            renderTrips(modifiedTrips, courantPage + 1, pageSize);
        });
        paginationHTML.appendChild(nextBtn);
    }
}