//Seznam kódů jednotlivých zemí, které jsou podstatné, k tomu, aby všechno jelo, tak jak má, jsou v souborech javascript_currencies_basic.js (jen 12 pevně daných měn,
//ale funguje to stejně jako javascript.currencies_full.js, což je vlastně obohacené o všechny měny na https://openexchangerates.org)
//Možné zlepšení: Rozšířit to napojením na nějaký soubor, takže to nebude takto pevně (omezeně) dané               
let Codes = ["EUR","USD","GBP","JPY","CNY","AUD","THB","SGD","TWD","CZK","BRL","BGN"];
//Maximální počet kurzů na měny, které to má zobrazit, nastavuje se v url parametrech
let MAXNUM; //!!!Nesmí překročit číslo 12!!!!
//Procenta (1% = 0.01, 100% = 1.00), o kolik levněji se budou kupovat měny
const zdrazeni = 0.05;
document.documentElement.style.setProperty('--z-index', '-2' );

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
    while(MAXNUM > 20){
        poradi.pop();
        MAXNUM = poradi.length;
        Oprava = true;
    }
    Codes = poradi
    var PovolovacSpusteni = true;
    //Nastavení hodnot, které nejsou v pořádku na základní (pro lang: en, pro zaklMena: CZK) 91.5
    if (Oprava === true){
        //Smazání parametrů
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        //Nastavení parametrů, tak aby to, co už bylo nastavené, zůstalo
        window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
        Oprava = false;
        PovolovacSpusteni = false;
    }
    document.documentElement.style.setProperty('--headundersize', String((100 - ((MAXNUM - 1)* 0.25) )/ (MAXNUM + 1)) + '%' );
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


function changeButtonMenaMAIN(NUM){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    zaklMena = CodesBackup[NUM];
    Codes = poradi;
    konecAkt();
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
//Funkce, kterou používám při kliknutí na aktuální měnu, která následně změní měnu v url parametrech
function changeMena(){
    document.documentElement.style.setProperty('--z-index', '5' );
    const aktNUM = CodesBackup.length - 1;
    let NUM = 0;    
    const parametryUrl = new URLSearchParams(window.location.search);
    let lang = parametryUrl.get('lang');
    let aktualization = `<div style="position: fixed; border: 1px solid grey; width: 3%; height: 5%; left: 77%; color: white; background-color: black; display: flex; justify-content: center;align-items: center;overflow-x: hidden;overflow-y: hidden;" onclick="konecAkt()">×</div>`;
    if (lang === 'cz'){
        aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMenaMAIN(${NUM})">${CodesBackup[NUM]} - ${menaJmenoCZ[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMenaMAIN(${NUM})">${CodesBackup[NUM]} - ${menaJmenoCZ[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        }
    }else if(lang === 'en'){
        aktualization = aktualization +  `<div class="aktu${NUM} aktunder" onclick="changeButtonMenaMAIN(${NUM})">${CodesBackup[NUM]} - ${menaJmenoEN[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMenaMAIN(${NUM})">${CodesBackup[NUM]} - ${menaJmenoEN[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        }
    }
    document.querySelector('.aktualizatormen').innerHTML = aktualization;
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
    if(MAXNUM > 20){
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


function konecAkt(){
    document.documentElement.style.setProperty('--z-index', '-2' );
    document.querySelector('.aktualizatormen').innerHTML = ``;;
}
function changeButtonMena(aaaNUM, NUM){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    poradi[aaaNUM] = CodesBackup[NUM];
    Codes = poradi;
    konecAkt();
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
function changeButtonI(aaaNUM){
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    zaklMena = parametryUrl.get('zaklMena');
    i = parametryUrl.get('i');
    poradi = parametryUrl.get('poradi') ? parametryUrl.get('poradi').split(',') : [];
    i = aaaNUM;
    Codes = poradi;
    konecAkt();
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    window.location.search += '&lang=' + lang +'&zaklMena='+ zaklMena + '&i=' + i +'&poradi=' + Codes;
}
function aktualizatorMen(aaaNUM){
    document.documentElement.style.setProperty('--z-index', '5' );
    const aktNUM = CodesBackup.length - 1;
    let NUM = 0;    
    const parametryUrl = new URLSearchParams(window.location.search);
    let lang = parametryUrl.get('lang');
    let aktualization = `<div style="position: fixed; border: 1px solid grey; width: 3%; height: 5%; left: 77%; color: white; background-color: black; display: flex; justify-content: center;align-items: center;overflow-x: hidden;overflow-y: hidden;" onclick="konecAkt()">×</div>`;
    if (lang === 'cz'){
        aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaJmenoCZ[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaJmenoCZ[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        }
    }else if(lang === 'en'){
        aktualization = aktualization +  `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaJmenoEN[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaJmenoEN[CodesBackup[NUM]]} (${menaVs[CodesBackup[NUM]]})</div>`;
        }
    }
    document.querySelector('.aktualizatormen').innerHTML = aktualization;
}
function aktualizatorStatMen(aaaNUM){
    document.documentElement.style.setProperty('--z-index', '5' );
    const aktNUM = CodesBackup.length - 1;
    let NUM = 0;    
    const parametryUrl = new URLSearchParams(window.location.search);
    let lang = parametryUrl.get('lang');
    let aktualization = `<div style="position: fixed; border: 1px solid grey; width: 3%; height: 5%; left: 77%; color: white; background-color: black; display: flex; justify-content: center;align-items: center;overflow-x: hidden;overflow-y: hidden;" onclick="konecAkt()">×</div>`;
    if (lang === 'cz'){
        aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaStatCZ[CodesBackup[NUM]]}</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaStatCZ[CodesBackup[NUM]]}</div>`;
        }
    }else if(lang === 'en'){
        aktualization = aktualization +  `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaStatEN[CodesBackup[NUM]]}</div>`;
        while (NUM < aktNUM){
            NUM = NUM + 1;
            aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonMena(${aaaNUM - 1}, ${NUM})">${CodesBackup[NUM]} - ${menaStatEN[CodesBackup[NUM]]}</div>`;
        }
    }
    document.querySelector('.aktualizatormen').innerHTML = aktualization;
}
function aktualizatorIMen(){
    document.documentElement.style.setProperty('--z-index', '5' );
    let NUM = 0;    
    const parametryUrl = new URLSearchParams(window.location.search);
    lang = parametryUrl.get('lang');
    i = parametryUrl.get('i');
    let langNUM;
    if(lang === langs[1]){
        langNUM = 1;
    }else if(lang === langs[0]){
        langNUM = 0;
    }
    let aktualization = `<div style="position: fixed; border: 1px solid grey; width: 3%; height: 5%; left: 77%; color: white; background-color: black; display: flex; justify-content: center;align-items: center;overflow-x: hidden;overflow-y: hidden;" onclick="konecAkt()">×</div>`;

    aktualization = aktualization +  `<div class="aktu${NUM} aktunder" onclick="changeButtonI(${NUM})">${NUM} ${textTransl["desetinne_carky"][langNUM]}</div>`;
    while (NUM < 100){
        NUM = NUM + 1;
        aktualization = aktualization + `<div class="aktu${NUM} aktunder" onclick="changeButtonI(${NUM} )">${NUM} ${textTransl["desetinne_carky"][langNUM]}</div>`;
    }
    
    document.querySelector('.aktualizatormen').innerHTML = aktualization;
}