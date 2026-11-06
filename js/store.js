export let trips = [];
async function chargeDonnees() {
    try{
        const response = await fetch("./data/trips.json");
        if(!response.ok){
            throw new Error("Fichier introuvable");
        }
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error(error.message);
        return [];
    }
}


function sauvegarder(trips){
    localStorage.setItem("trips", JSON.stringify(trips));
}

async function initialiser() {
    const donnees = localStorage.getItem("trips");
    if(donnees && donnees !== "undefined" && donnees !== null){
        try{
            return trips = JSON.parse(donnees);
        } catch(e){
            console.error("Corrupt local storage data, resetting...")
        }
    }
    const data = await chargeDonnees();
    if(data.length > 0){
        sauvegarder(data);
    }
    trips = data;
    return trips;
}
export { chargeDonnees, sauvegarder, initialiser };
