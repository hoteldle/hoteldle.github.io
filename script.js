function compareArrays(mainList, userIndex, randomIndex) {
    let outputArray = [];

    const selectedArray1 = mainList[userIndex];
    const selectedArray2 = mainList[randomIndex];

    for (let i = 0; i < selectedArray1.length; i++) {
        const array1 = selectedArray1[i];
        const array2 = selectedArray2[i];

        let found = false;

        for (let j = 0; j < array1.length; j++) {
            if (array2.includes(array1[j])) {
            found = true;
            break;
            }
        }

        if (!found) {
            outputArray.push(2);
        } else if (JSON.stringify(array1) === JSON.stringify(array2)) {
            outputArray.push(0);
        } else {
            outputArray.push(1);
        }
    }

    return outputArray;
}

//------------------------------------------------------------------------------\\

function check(mainList,userIndex,randomIndex,output,name){
    if (randomIndex === userIndex) {
        document.getElementById('Text').style.display = 'none';
    }
    const result = compareArrays(mainList, userIndex, randomIndex);
    console.log(result); // Output: [0, 1]
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper")
    output.insertBefore(wrapper,lastGuess)
    lastGuess = wrapper;
    let image = document.createElement("div");
    wrapper.appendChild(image);
    image.classList.add("Box");
    let tmp1 = document.createElement("p");
    let tmp2 = document.createTextNode(String(name));
    tmp1.appendChild(tmp2);
    image.appendChild(tmp1);
    for(let i = 0; i < 6; i++){
        const element = document.createElement("div");
        wrapper.appendChild(element);
        element.classList.add("Box" + result[i]);
        const para = document.createElement("p");
        let text = " "
        for (let j = 0; j < mainList[userIndex][i].length; j++) {
            text += String(mainList[userIndex][i][j]);
            if (j < mainList[userIndex][i].length - 1) {
                text += ", "
            }
            
        }
        const node = document.createTextNode(text);
        para.appendChild(node);
        element.appendChild(para);
        resize_to_fit(para,element)
    }

}

//------------------------------------------------------------------------------\\

function findIndex(array, searchString) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == searchString) {
            if (!usedIndexes.includes(i)) {
                usedIndexes.push(i); // Mark the index as used
                return i; // Return the index if the string is found and the index is not used
            } else {
                return -1; // Return -1 if the index is already used
            }
        }
    }
    return -1; // Return -1 if the string is not found in the array
}
//------------------------------------------------------------------------------\\

function resize_to_fit(para,element) {
    let fontSize = window.getComputedStyle(para).fontSize;
    
    if(para.clientHeight >= element.clientHeight){
      para.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
      resize_to_fit(para,element);
    }
    else if(Math.ceil(para.clientWidth) > 70) {
        para.style.fontSize = (parseFloat(fontSize) - 4) + 'px';
    }
  }

//------------------------------------------------------------------------------\\

function search() {
    let userIndex = findIndex(names,document.getElementById('name').value);
    if(userIndex != -1){check(mainList,userIndex, randomIndex, output,document.getElementById('name').value);}
}

//------------------------------------------------------------------------------\\

const names = ["Alastor","Angel Dust","Razzle & Dazzle","Sir Pentious","Vox","Rosie","Velvette","Valentino","Cherri Bomb","Husk","Adam","Lute","Niffty","Lucyfer", "Baxter", "Carmilla Carmine", "Egg Boiz", "Emily", "Fat Nuggets", "Katie Killjoy", "KeeKee", "Lilith", "Mimzy", "Molly", "Sera", "St. Peter", "Tom Trench", "Travis","Vaggie", "Zestial","Charlie"]
const usedIndexes = [];
const mainList = [
    [["Sinner"], ["Overlord"],[110],["Red"],["Male"],["Hotel","Alastor"]],
    [["Sinner"],["Normal"],[90],["White"],["Male"],["Hotel","Vees"]],
    [["Hellborn","Pet"], ["Demon"],["-"],["Red"],["Male"],["Lucyfer"]],
    [["Sinner","Winner"],["Normal"],[150],["Red","Black"],["Male"],["Hotel","Vees"]],
    [["Sinner"],["Overlord"],[100],["Blue"],["Male"],["Vees"]],
    [["Hellborn"],["Overlord"],["-"],["Red","White"],["Female"],["Canibal"]],
    [["Sinner"],["Overlord"],[25],["Red","Black"],["Female"],["Vees"]],
    [["Sinner"],["Overlord"],[80],["Red","White"],["Male"],["Vees"]],
    [["Sinner"],["Normal"],[80],["Red","White"],["Female"],["Hotel"]],
    [["Sinner"],["Overlord"],[80],["Red","Black"],["Male"],["Hotel","Alastor"]],
    [["Winner"],["Angel"],[60000],["White","Yellow"],["Male"],["Heaven","Adam"]],
    [["Heavenborn"],["Angel","Exorcist"],["-"],["White","Black"],["Female"],["Heaven","Adam"]],
    [["Sinner"],["Unknown"],[100],["Red","White"],["Female"],["Hotel","Alastor"]],
    [["Heavenborn"],["Seven Deadly Sins","Fallen Angel", "Morningstar"],["Inf"],["Red","White"],["Male"],["Seven Deadly Sins","Lucyfer"]],
    [["Sinner"],["Normal"],[130],["Black","Blue"],["Male"],["Unknown"]],
    [["Sinner"],["Overlord"],["-"],["White","Black"],["Female"],["Carmilla Carmine"]],
    [["Artificial"],["Demon"],["-"],["White","Yellow"],["Male"],["Sir Pentious","Hotel"]],
    [["Heavenborn"],["Seraph"],["-"],["White","Blue"],["Female"],["Heaven"]],
    [["Hellborn","Pet"],["Demon"],["-"],["Pink"],["Male"],["Hotel"]],
    [["Sinner"],["Normal"],[60],["Red"],["Female"],["TV"]],
    [["Hellborn","Pet"],["Demon"],["-"],["Black"],["Female"],["Hotel","Lucyfer"]],
    [["Sinner"],["Morningstar"],[60000],["Black"],["Female"],["Lucyfer","Exorcist"]],
    [["Sinner"],["Normal"],[130],["Red"],["Female"],["Alastor","Mammon"]],
    [["Winner"],["Normal"],[90],["White","Pink"],["Female"],["Heaven"]],
    [["Heavenborn"],["Seraph"],["-"],["White","Gray"],["Female"],["Heaven"]],
    [["Winner"],["Angel"],[1900],["White","Blue"],["Male"],["Heaven"]],
    [["Sinner"],["Normal"],[140],["Gray"],["Male"],["TV"]],
    [["Sinner"],["Normal"],[140],["Black"],["Male"],["Vees"]],
    [["Heavenborn"],["Fallen Angel"],["-"],["Red","Gray"],["Female"],["Hotel","Exorcist"]],
    [["Sinner"],["Overlord"],[500],["Black","Green"],["Male"],["Zestial"]],
    [["Hellborn"],["Morningstar"],[200],["Red","Black"],["Female"],["Hotel"]],
];
let lastGuess = null;
let output = document.getElementById('Output');
const randomIndex = Math.floor(Math.random() * mainList.length);
document.getElementById("Button").addEventListener("click", search);
