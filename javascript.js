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
//Seznam jazyků, ten první bude vždy brán jako výchozí.
const langs = ["en","cz"];
//Texty a překlady na webu, v [0] je jazyk "en", v [1] je jazyk "cz"
let textTransl = {
    "zem": ["Country:", "Země:"],
    "men": ["Currency:", "Měna:"],
    "kurz_prode": ["We buy for", "Koupíme za:"],
    "kurz_koup": ["We sell for:", "Prodáme za:"],
    "aktualni_mena": ["Actual Currency: ", "Aktuální měna: "]
};
document.addEventListener("DOMContentLoaded", function all() {
    console.log("start");
    //Klíč API, ze serveru openexchangerates.org
    const apiKey = '766970c19e8a4cab933b9f562bd4998b'; 
    const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    //Časovač na 30 minut(1 800 000 milisekund), aby se po 30 minutách spustil celý tento kód a aktualizovaly se data
    setTimeout(all, 1800000);
    const parametryUrl = new URLSearchParams(window.location.search);
    //Nastavení hodnot z URL parametrů
    let lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    zaklMena = menyseznam[zaklMena];
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    //Nastavení hodnot a1 a a2, což pak následně používám k nastavování url parametrů
    var Oprava = false; //Parametr, který při true obnoví poškozené url parametry
    //Zjišťování, které url parametry jsou v pořádku a které ne
    if(!(langs.includes(lang))){lang = langs[0]; Oprava = true;}
    if(!(zaklMena in menyseznam)){zaklMena = "CZK"; Oprava = true;}
    if((i > 100)|| !(i > -1)|| (i === null)|| (i === "")){i = 3; Oprava = true;}
    //Přípravné nastavení/přidaní/smazání určité hodnot/y v poradi
    if(poradi.length === 0){
        poradi[0] = CodesBackup[0];
        Oprava = true;
    }
    MAXNUM = poradi.length;
    let numA = 0;
    while ((numA <= MAXNUM - 1)){
        if (!(CodesBackup.includes(poradi[numA]))){
            poradi[numA] = CodesBackup[numA];
            Oprava = true;
        }
        numA = numA + 1;
    }        
    //Prozatimní!--------------------------------------------------------------------------------------<---------------------------------------------
    while(MAXNUM > 12){
        poradi.pop();
        MAXNUM = poradi.length;
        Oprava = true;
    }
    Codes = poradi
    var PovolovacSpusteni = true;
    //Nastavení hodnot, které nejsou v pořádku na základní (pro lang: en, pro zaklMena: CZK)
    if (Oprava === true){
        //Smazání parametrů
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        //Nastavení parametrů, tak aby to, co už bylo nastavené, zůstalo
        window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
        Oprava = false;
        PovolovacSpusteni = false;
    }
    //Konec nastatování url parametrů
    //Přizařovač znaku aktuální měny
    const menaVse = menaVs[zaklMena];
    //Zvolení překladů
    let langNUM;
    if(lang === langs[1]){
        langNUM = 1;
    }else if(lang === langs[0]){
        langNUM = 0;
    }
    const divTexty = ["zem", "men", "kurz_prode", "kurz_koup"];
    let translNUM = 0;
    while(translNUM < divTexty.length){
        document.getElementById(divTexty[translNUM]).textContent = textTransl[divTexty[translNUM]][langNUM];
        translNUM = translNUM + 1;
    }
   //Určovač, co bude se zobrazí za vlajku, když na ni kliknete
    document.querySelector('.jazyk').innerHTML = `<img id="lang_img" src="${lang}.png" alt="${lang}">`;
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
    //Připojení na https://openexchangerates.org/api/latest.json?app_id=${apiKey} pouze při správných parametrech
    if(PovolovacSpusteni){
        console.log("start--");
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
                document.querySelector('.aktualni_mena').textContent = `${textTransl["aktualni_mena"][langNUM]}${menaJmeno[zaklMena]} (${zaklMena})`;

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
    }
    PovolovacSpusteni = true;
});
//Funkce, kterou používám při kliknutí na vlajku, která následně změní jazyk a obrázek v url parametrech
function changeLanguage(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    let searchNUM = 0;
    while (!(langs[searchNUM] === lang)){
        searchNUM = searchNUM + 1;
    }
    if(searchNUM === langs.length - 1){
        searchNUM = 0;
    }else if(searchNUM > langs.length - 1){
        searchNUM = 0;
    }else{
        searchNUM = searchNUM + 1;
    }
    lang = langs[searchNUM];
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
//Funkce, kterou používám při kliknutí na aktuální měnu, která následně změní měnu v url parametrech
function changeMena(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
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
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
//Funkce, kterou používám při kliknutí na určitý název státu, kde se používá měna, která následně změní stát v url paramatrech, posune se to o stát dál
function changeDivMena(numB){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
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
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
//Funkce přidávající další měnu
function pridaniRadkuMeny(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    poradi.push(CodesBackup[0]);
    MAXNUM = poradi.length;   
    //Prozatimní!--------------------------------------------------------------------------------------<---------------------------------------------
    if(MAXNUM > 12){
        poradi.pop();
        MAXNUM = poradi.length;
    }
    Codes = poradi;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
//Funkce odebírající měnu
function odstraneniRadkuMeny(){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    poradi.pop();
    MAXNUM = poradi.length;   
    //Prozatimní!--------------------------------------------------------------------------------------<---------------------------------------------
    if(poradi.length === 0){
        poradi[0] = CodesBackup[0];
    }
    Codes = poradi;
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}