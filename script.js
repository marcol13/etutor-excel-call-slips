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
    toSheet(dictionary)
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

function deleteInPolish(str){
    const signs = [`technical`, `British`, `American`, `informal`, `Canadian`, `Australian`, `New Zealand`, `Scottish`, `South African`, `latin`, `slang`, `formal`, `old-fashioned`, `old use`, `spoken`, `written`, `not polite`, `taboo`, `trademark`, `dialect`, `loan-word`, `humorous`]
    for(let i of signs){
        str = str.replace(new RegExp(i ,"g"),"")
    }
    return str
}

function deleteUnwanted(str){
    const signs = [`=`, `↵`]
    const special = [[`&quot;`,`"`],[`&apos;`,`'`]]
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
    const eFindBegin = `<span class="hw">`
    const eFindEnd = `<`
    const pFindBegin = /<\/span>(\n|\r){2}\s*=/
    const pFindEnd = `&nbsp;`
    while(str.indexOf(eFindBegin) != -1 && str.search(pFindBegin) != -1){
        eTextBegin = str.indexOf(eFindBegin) + eFindBegin.length
        englishText = str.slice(eTextBegin,str.indexOf(eFindEnd,eTextBegin))
        pTextBegin = str.search(pFindBegin) + 7
        let indexEnd = str.indexOf(pFindEnd, pTextBegin)
        polishText = str.slice(pTextBegin, indexEnd)
        arr.push(new CallSlip(deleteUnwanted(englishText), deleteUnwanted(deleteInPolish(polishText))))
        str = str.slice(indexEnd)
    }
}

function toSheet(arr){
    var wb = XLSX.utils.book_new()
    date = new Date()
    wb.Props = {
        Title: "eTutor",
        Subject: "Call slips",
        Author: "",
        CreateDate: `${date.getFullYear()},${date.getMonth()},${date.getDate()}`
    }
    wb.SheetNames.push("Test Sheet")
    var ws_data = []
    for(let i of arr){
        ws_data.push([i.english,i.polish])
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets["Test Sheet"] = ws
    var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'})
    
    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf; 
    }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'callslips.xlsx');   

}