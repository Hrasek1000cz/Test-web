
let prohazovac = 1;
let lekceURC = 7;
document.addEventListener("DOMContentLoaded", function all() {
    document.documentElement.style.setProperty('--color', "gainsboro" );
    const randomak = Math.floor(Math.random() * lekce[lekceURC]["počet"]);
    document.querySelector('.lekce').textContent = `Lekce ${lekceURC}`;
    document.querySelector('.pocetslov').textContent = `Budoucí popis lekce (počet slov:${lekce[lekceURC]["počet"]})`;
    document.querySelector('.aaa').textContent = `${lekce[lekceURC][randomak][0]}`;
    document.querySelector('.bbb').textContent = `${lekce[lekceURC][randomak][1]}`;
})
function dalsi(){
    document.documentElement.style.setProperty('--color', "gainsboro" );
    const randomak = Math.floor(Math.random() * lekce[lekceURC]["počet"]);
    if(prohazovac === 1){
        document.querySelector('.lekce').textContent = `Lekce ${lekceURC}`;
        document.querySelector('.aaa').textContent = `${lekce[lekceURC][randomak][0]}`;
        document.querySelector('.bbb').textContent = `${lekce[lekceURC][randomak][1]}`;
    }else{
        document.querySelector('.lekce').textContent = `Lekce ${lekceURC}`;
        document.querySelector('.aaa').textContent = `${lekce[lekceURC][randomak][1]}`;
        document.querySelector('.bbb').textContent = `${lekce[lekceURC][randomak][0]}`;
    }
}
function dalsien(){
    if(prohazovac === 1){
        prohazovac=2;
    }else{
        prohazovac=1;
    }
    dalsi();
}
function odpověď(){
    document.documentElement.style.setProperty('--color', "black" );
}
function zmenalekc(){
    if(lekceURC === 10){
        lekceURC = 1;}
    else{
        lekceURC = lekceURC + 1;
    }

    document.querySelector('.pocetslov').textContent = `Budoucí popis lekce (počet slov:${lekce[lekceURC]["počet"]})`;
    dalsi();
}