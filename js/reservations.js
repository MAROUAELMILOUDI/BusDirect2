export function estVIP(numero){
    if(numero >= 1 && numero <= 4){
        return true;
    }
    return false;
}
export function prixSiege(prix, numero){
    if(estVIP(numero)){
        return Math.round(prix * 1.1)
    }
    return prix;
}