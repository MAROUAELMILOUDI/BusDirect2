import { initialiser } from "./store.js";
const trips = await initialiser();
console.table(trips);