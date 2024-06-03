const menaStatCZ = {
    "USD": "USA",
    "EUR": "Eurozóna",
    "GBP": "Spojené království",
    "JPY": "Japonsko",
    "CNY": "Čína",
    "CZK": "Česká republika",
    "AUD": "Austrálie",
    "THB": "Thajsko",
    "SGD": "Singapur",
    "TWD": "Tchaj-wan",
    "BRL": "Brazílie",
    "BGN": "Bulharsko"
};
const menaStatEN = {
    "USD": "USA",
    "EUR": "Eurozone",
    "GBP": "United Kingdom",
    "JPY": "Japan",
    "CNY": "China",
    "CZK": "Czech republic",
    "AUD": "Australia",
    "THB": "Thailand",
    "SGD": "Singapore",
    "TWD": "Taiwan",
    "BRL": "Brazil",
    "BGN": "Bulgaria"
};
const menaJmenoCZ = {
    "USD": "Dolar",
    "EUR": "Euro",
    "GBP": "Libra",
    "JPY": "Jen",
    "CNY": "Yüan",
    "CZK": "Koruna",
    "AUD": "Dolar",
    "THB": "Baht",
    "SGD": "Dolar",
    "TWD": "Nový dolar",
    "BRL": "Reál",
    "BGN": "Lev"
};
let menaJmenoEN = {
   "USD": "Dollar",
   "EUR": "Euro",
   "GBP": "Pound",
   "JPY": "Yen",
   "CNY": "Yüan",
   "CZK": "Czech Crown",
   "AUD": "Dollar",
   "THB": "Baht",
   "SGD": "Dollar",
   "TWD": "New Dollar",
   "BRL": "Real",
   "BGN": "Lion"
};
const menaVlajky = {
    "CZK": "cz",
    "USD": "us",
    "EUR": "eu",
    "JPY": "jp",
    "CNY": "cn",
    "AUD": "au",
    "THB": "th",
    "SGD": "sg",
    "TWD": "tw",
    "BRL": "br",
    "BGN": "bg",
    "GBP": "gb"
};
//Seznam, který se zdá na první pohled zbytečný a nesmyslný, ale zatím přes něj mám udělaný kontrolovač url parametrů, který v případě že v tomto seznamu měnu nenajde, tak zaklMena nastaví na CZK
//Možné zlepšení: Obejít se bez tohoto seznamu, takže by byl kratší kód
const menyseznam = {
    "USD": "USD",
    "EUR": "EUR",
    "GBP": "GBP",
    "JPY": "JPY",
    "CNY": "CNY",
    "CZK": "CZK",
    "AUD": "AUD",
    "THB": "THB",
    "SGD": "SGD",
    "TWD": "TWD",
    "BRL": "BRL",
    "BGN": "BGN"
}
//U jednotlivých kódů zemí je zde přiřazen znak měny

var menaVs = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "CNY": "¥",
    "CZK": "Kč",
    "AUD": "$",
    "THB": "฿",
    "SGD": "$",
    "TWD": "$",
    "BRL": "R$",
    "BGN": "лв"
}
let CodesBackup = ["EUR","USD","GBP","JPY","CNY","AUD","THB","SGD","TWD","CZK","BRL","BGN"];