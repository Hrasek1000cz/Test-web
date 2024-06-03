//Seznam kódů jednotlivých zemí, které jsou podstatné, k tomu, aby všechno jelo, tak jak má, jsou v souborech javascript_currencies_basic.js (jen 12 pevně daných měn,
//ale funguje to stejně jako javascript.currencies_full.js, což je vlastně obohacené o všechny měny na https://openexchangerates.org)
//Možné zlepšení: Rozšířit to napojením na nějaký soubor, takže to nebude takto pevně (omezeně) dané               
let Codes = ["EUR","USD","GBP","JPY","CNY","AUD","THB","SGD","TWD","CZK","BRL","BGN"];
//Maximální počet kurzů na měny, které to má zobrazit, nastavuje se v url parametrech
let MAXNUM; //!!!Nesmí překročit číslo 12!!!!
//Procenta (1% = 0.01, 100% = 1.00), o kolik levněji se budou kupovat měny
const zdrazeni = 0.05;
//Hodnota i zde znamená, nakolik desetinných míst chceme ukázat finální kurzy, nastavuje se v url parametrech
let i;
//Překlady pro českou a anglickou verzi v div pod class „zeme“
const translZem = {
    "cz": "Země:",
    "en": "Country:"
};
//Překlady pro českou a anglickou verzi v div pod class „mena“
const translMen= {
    "cz": "Měna:",
    "en": "Currency:"
};
//Překlady pro českou a anglickou verzi v div pod class „kurz_prodej“
const translKKo= {
    "cz": "Koupíme za:",
    "en": "We buy for"
};
//Překlady pro českou a anglickou verzi v div pod class „kurz_koupe“
const translKPr= {
    "cz": "Prodáme za:",
    "en": "We sell for:"
};
//Překlady pro českou a anglickou verzi v div pod class „kurz_koupe“
const actCurr = {
    "cz": "Aktuální měna: ",
    "en": "Actual Currency: "
};
document.addEventListener("DOMContentLoaded", function all() {
    //Klíč API, ze serveru openexchangerates.org
    const apiKey = '766970c19e8a4cab933b9f562bd4998b'; 
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    //Časovač na 30 minut(1 800 000 milisekund), aby se po 30 minutách spustil celý tento kód a aktualizovaly se data
    setTimeout(all, 18000000);
    const parametryUrl = new URLSearchParams(window.location.search);
    //Nastavení hodnot z URL parametrů
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    zaklMena = menyseznam[zaklMena];
    i = parametryUrl.get('i');
    MAXNUM = parametryUrl.get('MAXNUM');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    //Nastavení hodnot a1 a a2, což pak následně používám k nastavování url parametrů
    //Možné zlepšení: Vymyslet to inteligentněji, zkrátit to
    var a1; //Pro parametr lang
    var a2; //Pro parametr zaklMena
    var a3; //Pro parametr i
    var a4; //Pro parametr MAXNUM
    var a5 = true; //Pro parametr poradi
    //Zjišťování, které url parametry jsou v pořádku a které ne
    if((lang === "cz")||(lang === "en")){a1 = true;}else{a1 = false;}
    if(zaklMena in menyseznam){a2 = true;}else{a2 = false;}
    if((i < 101)&(i > - 1)){a3 = true;}else{a3 = false;}
    if((MAXNUM < 13)&(MAXNUM > 0)){a4 = true;}else{a4 = false;}
    //Spravení hodnot i a MAXNUM
    if(!a3){i = 3;}
    if(!a4){MAXNUM = 12;}

    //Přípravné nastavení/přidaní/smazání určité hodnot/y v poradi
    let numA = 0;
    while (numA <= poradi.length - 1){
        if (!(CodesBackup.includes(poradi[numA]))){
            poradi[numA] = CodesBackup[numA];
            a5 = false;
        }
        numA = numA + 1;
    }        
    while (numA <= MAXNUM - 1){
        poradi[numA] = CodesBackup[numA];
        numA = numA + 1;
        a5 = false;
    }
    while(poradi.length > MAXNUM){
        poradi.pop();
        a5 = false;
    }
    Codes = poradi;

    //Nastavení hodnot, které nejsou v pořádku na základní (pro lang: en, pro zaklMena: CZK)
    if (!a2 || !a1 || (!a3 || !a4 || !a5) ){
        //Smazání parametrů
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        //Nastavení parametrů, tak aby to, co už bylo nastavené, zůstalo
        if(!a3||!a4||!a5){
            window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i + '&MAXNUM=' + MAXNUM +'&poradi=' + Codes;
        }else if(a1 === a2){
            window.location.search += '&lang=en&zaklMena=CZK&i='+ i + '&MAXNUM=' + MAXNUM +'&poradi=' + Codes;
        }else if(!a2){
            window.location.search += '&lang=' + lang +'&zaklMena=CZK&i='+ i + '&MAXNUM=' + MAXNUM +'&poradi=' + Codes;
        }else if(!a1){
            window.location.search += '&lang=en&zaklMena='+ zaklMena + '&i=' + i + '&MAXNUM=' + MAXNUM +'&poradi=' + Codes;
        }
    }
    //Konec nastatování url parametrů
    //Přizařovač znaku aktuální měny
    const menaVse = menaVs[zaklMena];
    //Zvolení překladů
    document.getElementById("zem").textContent = translZem[lang];
    document.getElementById("men").textContent = translMen[lang];
    document.getElementById("kurz_prode").textContent = translKKo[lang];
    document.getElementById("kurz_koup").textContent = translKPr[lang];
    //Funkce, která mi volí jazyky (čeština= item1, angličtina=item2)
    function languager(lang, item1, item2){
        var ccc;
        ccc = lang;
        if (ccc === "cz"){
            ddd = item1;
        }
        else if (ccc === "en")
        {
            ddd = item2;
        }

        return ddd;
    };
    //Nastavování jazyků 
    const menaStat = languager(lang, menaStatCZ,menaStatEN);
    const menaJmeno = languager(lang, menaJmenoCZ,menaJmenoEN);
    //Připojení na https://openexchangerates.org/api/latest.json?app_id=${apiKey}
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //Tyto odkazy jsou základní třídy bez čísel, vždycky se z nim nakonec připojí to číslo a vznikne třída, kterou mám zapsanou v divech
            var odkazkupr ='.kurz_prodej';
            var odkazkuko ='.kurz_koupe';
            var odkazze = '.zeme';
            var odkazme ='.mena';
            var odkazvl = '.zeme_vlajka';
            let number = 0;
            //czk je základní(aktuální) hodnota měny, podle které se všechno řídí
            const czk = data.rates[zaklMena]; 
            document.querySelector('.aktualni_mena').textContent = `${actCurr[lang]}${menaJmeno[zaklMena]} (${zaklMena})`;
            //Určovač, co bude se zobrazí za vlajku, když na ni kliknete
            if(lang === "cz"){
                document.querySelector('.jazyk').innerHTML = `<img id="lang_img" src="en.png" alt="en">`;
            }else if(lang === "en"){
                document.querySelector('.jazyk').innerHTML = `<img class="zeme_vlajky" src="cz.png" alt="cz">`;
            }
            //Nastavení hodnoty na prodej
            function exchangeRat(currency){
                const exchange = czk / data.rates[currency];
                const aaa = `${exchange.toFixed(i)} ${menaVse}`;
                return aaa;
            }
            //Nastavení hodnoty na koupi
            function buyRat(currency){
                const buy = czk / data.rates[currency] * (1 - zdrazeni);
                const bbb = `${buy.toFixed(i)} ${menaVse}`;
                return bbb;
            }
            //Funkce která jednotlivým divům přiřazuje to co k nim má zrovna patřit (MAXNUM je zde maxiální číslo u jednotlivých divů )
            while (number < MAXNUM){
                currencyCode = Codes[number];
                number = number + 1;

                var cislo = String (number);
                var odkaz1 = odkazkupr + cislo;
                var odkaz2 = odkazkuko + cislo;
                var odkaz3 = odkazze + cislo;
                var odkaz4 = odkazme + cislo;
                var odkaz5 = odkazvl + cislo;
                //Žluté označení v případě, že se zrovna dělá řádek s měnou, která je zároveň nastavená jako základní(aktuální)
                if(currencyCode === zaklMena){
                    document.querySelector(odkaz1).innerHTML  = `<div class="actual">${exchangeRat(currencyCode)}</div>`;
                    document.querySelector(odkaz2).innerHTML  = `<div class="actual">${buyRat(currencyCode)}</div>`;
                    document.querySelector(odkaz3).innerHTML = `<div class="actual">${menaStat[currencyCode]} (${currencyCode})</div>`;
                    document.querySelector(odkaz4).innerHTML  = `<div class="actual">${menaJmeno[currencyCode]} (${menaVs[currencyCode]})</div>`;
                }else{
                    document.querySelector(odkaz1).textContent  = exchangeRat(currencyCode);
                    document.querySelector(odkaz2).textContent  = buyRat(currencyCode);
                    document.querySelector(odkaz3).textContent = `${menaStat[currencyCode]} (${currencyCode})`;
                    document.querySelector(odkaz4).textContent  = `${menaJmeno[currencyCode]}(${menaVs[currencyCode]})`;
                }
                document.querySelector(odkaz5).innerHTML = `<img class="zeme_vlajky" src="https://flagcdn.com/w40/${menaVlajky[currencyCode]}.png" alt="${menaStat[currencyCode]}">`;
            }
        })
        .catch(error => console.error('Chyba:', error));
});
//Funkce, kterou používám při kliknutí na vlajku, která následně změní jazyk a obrázek v url parametrech
function changeLanguage(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    MAXNUM = parametryUrl.get('MAXNUM');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    if(lang === "cz"){
        window.location.search += '&lang=en&zaklMena='+ zaklMena +'&i=' + i + '&MAXNUM=' + MAXNUM +'&poradi=' + poradi;;
        document.querySelector('.jazyk').innerHTML = `<img id="lang_img" src="en.png" alt="en">`;
    }else if(lang === "en"){
        window.location.search += '&lang=cz&zaklMena='+ zaklMena +'&i=' + i+ '&MAXNUM=' + MAXNUM +'&poradi=' + poradi;;
        document.querySelector('.jazyk').innerHTML = `<img class="zeme_vlajky" src="cz.png" alt="cz">`;
    }
}
//Funkce, kterou používám při kliknutí na aktuální měnu, která následně změní měnu v url parametrech
function changeMena(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    MAXNUM = parametryUrl.get('MAXNUM');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    let numberHledaci = 0;
    while (!(CodesBackup[numberHledaci] === zaklMena)){
        numberHledaci = numberHledaci + 1;
    }
    if(numberHledaci === CodesBackup.length - 1){
        numberHledaci = 0;
    }else if(numberHledaci > CodesBackup.length - 1){
        numberHledaci = 0;
    }else{
        numberHledaci = numberHledaci + 1;
    }
    zaklMena = CodesBackup[numberHledaci];
    window.location.search += '&lang=' + lang + '&zaklMena='+ zaklMena +'&i=' + i + '&MAXNUM=' + MAXNUM +'&poradi=' + poradi;
}
//Funkce, kterou používám při kliknutí na určitý název státu, kde se používá měna, která následně změní stát v url paramatrech, posune se to o stát dál
function changeDivMena(numB){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    MAXNUM = parametryUrl.get('MAXNUM');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];

    let numberHledaci = 0;
    while (!(CodesBackup[numberHledaci] === poradi[numB-1])){
        numberHledaci = numberHledaci + 1;
    }
    if(numberHledaci === CodesBackup.length - 1){
        numberHledaci = 0;
    }else if(numberHledaci > CodesBackup.length - 1){
        numberHledaci = 0;
    }else{
        numberHledaci = numberHledaci + 1;
    }
    poradi[numB-1] = CodesBackup[numberHledaci];


    Codes = poradi;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang + '&zaklMena='+ zaklMena +'&i=' + i+ '&MAXNUM=' + MAXNUM +'&poradi=' + poradi;;
}