const myDictionaryElements = [];
const myDictionaries = [];
let puffer = [];

class Dictionaries {

    constructor(id, dictionaryName, langPrim, langSec, relaseDate) {
        this.id = id;
        this.dictionaryName = dictionaryName;
        this.langPrim = langPrim;
        this.langSec = langSec;
        this.relaseDate = relaseDate;
    }
};

class DictionaryElement {

    constructor(id, dictionaryName, article_1, word_1, plural_1, article_2, word_2, plural_2, lang_1, lang_2, relaseDate) {
        this.id = id;
        this.dictionaryName = dictionaryName;
        this.article_1 = article_1;
        this.word_1 = word_1;
        this.plural_1 = plural_1;
        this.article_2 = article_2;
        this.word_2 = word_2;
        this.plural_2 = plural_2;
        this.lang_1 = lang_1;
        this.lang_2 = lang_2;
        this.relaseDate = relaseDate;
    }

};


function readJson(source, myObject, myMethod) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            myMethod(JSON.parse(this.responseText), myObject);
        }
    };
    xmlhttp.open("GET", source, true);
    xmlhttp.send();
};

function readJson_V2(source) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            puffer.push(JSON.parse(this.responseText));
        }
    };

    xmlhttp.open("GET", source, true);
    xmlhttp.send();

};



var oXHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

function reportStatus() {
    if (oXHR.readyState == 4)                   // Request completed.
        showTheList(this.responseText);
    // All set. Now show the data.
}

oXHR.onreadystatechange = reportStatus;
oXHR.open("GET", "./data/db_words.json", true);          // true = ASYNCHRONOUS REQUEST (DESIRABLE), false = SYNCHRONOUS REQUEST.
oXHR.send();

reportStatus()

//var data = [];

function showTheList(json) {

    puffer = JSON.parse(json);

    for (i = 0; i <= puffer.length - 1; i++) {

        //var element = {};

        var component = new DictionaryElement(puffer[i].ID, puffer[i].DictionaryID, puffer[i].Article_1, puffer[i].Word_1, puffer[i].Plural_1, puffer[i].Article_2, puffer[i].Word_2, puffer[i].Plural_2, puffer[i].Lang_1, puffer[i].Lang_2, puffer[i].RelaseDate);

        //element[puffer[i].DictionaryID] = component;
        //myDictionaryElements.push(element);
        myDictionaryElements.push(component);
    }
}


function createDictionaryObject(sourceObj, targetObj) {
    for (const data of sourceObj) {
        var element = {};
        var component = new Dictionaries(data.ID, data.Dictionary_Name, data.Lang_Prim, data.Lang_Sec, data.RelaseDate);
        element[data.DictionaryID] = component;
        targetObj.push(element);
    }
};


function createDictionaryElementObject(sourceObj, targetObj) {
    for (const data of sourceObj) {
        var component = new DictionaryElement(data.ID, data.DictionaryID, data.Article_1, data.Word_1, data.Plural_1, data.Article_2, data.Word_2, data.Plural_2, data.Lang_1, data.Lang_2, data.RelaseDate);
        targetObj.push(component);
    }
};


function initalizeObjects() {
    //readJson("./data/db_dictionaries.json", myDictionaries, createDictionaryObject);
    //readJson("./data/db_words.json", myDictionaryElements, createDictionaryElementObject);

    // readJson_V2("./data/db_words.json", puffer);
    //createDictionaryElementObject(puffer, myDictionaryElements);
    //console.log(groupByKey(puffer, 'DictionaryID'));

}


initalizeObjects();



function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
};
