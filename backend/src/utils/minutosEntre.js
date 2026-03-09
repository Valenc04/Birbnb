export function minutosEntre(date1, date2) { //Deben ser 2 dates
    const diferencia = date2 - date1 //milisegundos
    return Math.floor(diferencia /(1000*60)) //minutos 
}