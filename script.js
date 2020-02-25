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
        //console.log(temp)
        str = str.slice(indexE)
    }
    return result
}
//code = reduceCode(code)

function toDictionary(str, arr){
    const englishTextBFind = `<span class="hw">`
    const englishTextEFind = `<`
    const polishTextBFind = `</a></span></span>`
    const polishTextEFind = `&nbsp;`
    replaceItems = [`</span>`,`=`]
    console.log(str.indexOf(englishTextBFind))
    while(str.indexOf(englishTextBFind) != -1 && str.indexOf(polishTextBFind) != -1){
        console.log(str.indexOf(englishTextBFind) + englishTextBFind.length)
        englishTextB = str.indexOf(englishTextBFind) + englishTextBFind.length
        englishText = str.slice(englishTextB,str.indexOf(englishTextEFind,englishTextB))
        polishTextB = str.indexOf(polishTextBFind) + polishTextBFind.length
        let indexEnd = str.indexOf(polishTextEFind, polishTextB)
        polishText = str.slice(polishTextB, indexEnd)

        polishText = polishText.replace(`</span>`,"")
        polishText = polishText.replace(`=`,"")
        arr.push(new CallSlip(englishText.trim(), polishText.trim()))
        str = str.slice(indexEnd)
    }
}

//toDictionary(code, dictionary)