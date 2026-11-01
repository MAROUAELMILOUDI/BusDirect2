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
    }
}


function sauvegarder(trips){
    localStorage.setItem("trips", JSON.stringify(trips));
}
const trips = await chargeDonnees();
if(trips){
    sauvegarder(trips);
}