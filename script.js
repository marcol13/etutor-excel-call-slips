function getText(){
    return document.querySelector("textarea.site-code").value
} 

class CallSlip{
    constructor(english, polish){
        this.english = english
        this.polish = polish
    }
}

var dictionary = []
var code = ""
btn = document.querySelector("button.submit-button")
btn.addEventListener("click", () => {
    code = getText()
    code = reduceCode(code)
    toDictionary(code, dictionary)
})

function reduceCode(str){
    findText = `<p class="hws phraseEntity">`
    result = ""
    while(str.indexOf(findText) != -1){
        indexB = str.indexOf(findText)
        indexE = str.indexOf("</p>", indexB)
        temp = str.slice(indexB, indexE)
        result += temp
        str = str.slice(indexE)
    }
    return result
}

function deleteUnwanted(str){
    signs = [`=`, `↵`, `technical`, `British`, `American`]
    special = [[`&quot;`,`"`],[`&apos;`,`'`],[]]
    for(let i of signs){
        str = str.replace(new RegExp(i ,"g"),"")
    }
    for(let i of special){
        //str = str.replace(new RegExp(i[0],"g"),i[1]) dont know why it doesnt work
        while(str.indexOf(i[0]) != -1){
            str = str.replace(i[0],i[1])
        }
    }
    
    while(str.indexOf("<") != -1){
        let beginIndex = str.indexOf("<")
        let endIndex = str.indexOf(">")
        str = str.replace(str.substring(beginIndex, endIndex+1),"")
    }
    str = str.trim()
    const carReturn = new RegExp("\r|\n","g") 
    let indexCar = function(text){
        var lastIndex = -1
        var maxIndex = 0
        while(text.search(carReturn) != -1){
            lastIndex = text.search(carReturn)
            maxIndex += lastIndex + 1
            console.log(lastIndex)
            text = text.slice(lastIndex + 1)
        }
        return maxIndex > 0 ? maxIndex : lastIndex
    }
    if(indexCar(str) != -1)
        str = str.slice(indexCar(str) + 1).trim()
    if(str[0] == ",")
        str = str.slice(1)
    return str.trim()
}

function toDictionary(str, arr){
    const englishTextBFind = `<span class="hw">`
    const englishTextEFind = `<`
    const polishTextBFind = `</a></span></span>`
    const polishTextEFind = `&nbsp;`
    console.log(str.indexOf(englishTextBFind))
    while(str.indexOf(englishTextBFind) != -1 && str.indexOf(polishTextBFind) != -1){
        console.log(str.indexOf(englishTextBFind) + englishTextBFind.length)
        englishTextB = str.indexOf(englishTextBFind) + englishTextBFind.length
        englishText = str.slice(englishTextB,str.indexOf(englishTextEFind,englishTextB))
        polishTextB = str.indexOf(polishTextBFind) + polishTextBFind.length
        let indexEnd = str.indexOf(polishTextEFind, polishTextB)
        polishText = str.slice(polishTextB, indexEnd)
        arr.push(new CallSlip(deleteUnwanted(englishText), deleteUnwanted(polishText)))
        str = str.slice(indexEnd)
    }
}
