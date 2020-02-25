function getText(){
    return document.querySelector("textarea.site-code").value
} 

class CallSlip{
    constructor(english, polish){
        this.english = english
        this.polish = polish
    }
}

var code = ""
btn = document.querySelector("button.submit-button")
btn.addEventListener("click", () => {code = getText()})

function reduceCode(str){
    findText = "<p class=\"hws phraseEntity\">"
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
code = reduceCode(code)

function toDictionary(str){
    
}