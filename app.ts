const para = document.createElement("p");
const spa = document.createElement("span");
spa.setAttribute("class", "output-browser");
para.appendChild(spa);

document.body.appendChild(para);

// detect browser
// Get the user-agent string 
const userAgentString = navigator.userAgent; 

// Detect Chrome 
let chromeAgent = userAgentString.indexOf("Chrome") > -1; 

// Detect Internet Explorer 
const IExplorerAgent = userAgentString.indexOf("MSIE") > -1; 

// Detect Edge 
let edgeAgent = userAgentString.indexOf("Edg") > -1; 

// Detect Firefox 
const firefoxAgent = userAgentString.indexOf("Firefox") > -1; 

// Detect Safari 
let safariAgent = userAgentString.indexOf("Safari") > -1; 
  
// Discard Safari since it also matches Chrome 
if ((chromeAgent) && (safariAgent)) safariAgent = false; 

// Detect Opera 
let operaAgent = userAgentString.indexOf("OP") > -1; 
  
// Discard Chrome since it also matches Opera         
if ((chromeAgent) && (operaAgent)) chromeAgent = false; 

// Discard Chrome since it also matches Edge         
if ((chromeAgent) && (edgeAgent)) chromeAgent = false; 

const usedBrowsers: { name: string, isUsed: boolean }[] = [
  { name: "Chrome", isUsed: chromeAgent },
  { name: "MSIE", isUsed: IExplorerAgent },
  { name: "Edge", isUsed: edgeAgent },
  { name: "Firefox", isUsed: firefoxAgent },
  { name: "Safari", isUsed: safariAgent },
  { name: "OP", isUsed: operaAgent },
];

outputUsedBrowser();

function outputUsedBrowser() {
  for (let usedBrowser of usedBrowsers) {
    if (usedBrowser.isUsed) {
      document.querySelector(".output-browser")!.textContent = usedBrowser.name + " is used.";
      break;
    }
  }
}

const riddle = document.createElement("div");
riddle.id = "riddle";
document.body.appendChild(riddle);

//shuffle the parts
const puzzlePartsIdx = shufflePuzzleParts();

//add pictures for random puzzle
for (let i = 0; i < puzzlePartsIdx.length; i++) {
  const img = document.createElement("img");
  const imgId = "part" + puzzlePartsIdx[i];

  img.setAttribute("src", "img/img" + puzzlePartsIdx[i] + ".jpg");
  img.setAttribute("alt", imgId);
  img.setAttribute("id", imgId);
  
  img.addEventListener("click", () => {
    const currentImgId = img.getAttribute("id")!;
    const imgElement = document.getElementById(currentImgId)!;

    if (!isSolved()) {
      if (isSelectable()) {
        
        const firstSelectedPuzzlePartId = getAlreadySelectedPicId();

        //set opacity for clicked element
        imgElement.style.opacity = "1.0";
        if (imgElement.style.opacity != "0.6") {
          imgElement.style.opacity = "0.6";
        }

        //swap parts, when more than 1 part is selected
        if (countSelected() > 1) {
          if (areNeighbours(firstSelectedPuzzlePartId, currentImgId)) {
            swapParts();
          }
          resetOpacity();
        }
      }
    }
  });
    
  riddle.appendChild(img);
}

function isSelectable() {
  return countSelected() <= 1;
}


function countSelected() {
	const pics = riddle.getElementsByTagName("img");
	let counter = 0;
	
	// count selected elements
  for (let i = 0; i < pics.length; i++) {
    if (pics[i].style.opacity == "0.6") {
			counter++;
		}
	}
	
	return counter;
}

function getAlreadySelectedPicId() {
  const pics = riddle.getElementsByTagName("img");
	let counter = 0;
	
	// find selected element
  for (let i = 0; i < pics.length; i++) {
    if (pics[i].style.opacity == "0.6") {
      return pics[i].getAttribute("id")!;
		}
  }
  
  return "";
}

function isSolved() {
	const pics = riddle.getElementsByTagName("img");
	
  //check if the parts are sorted
  for (let i = 0; i < pics.length; i++) {
    const pic = "part" + (i + 1).toString();
		const element = pics[i].getAttribute("id");
		
    if (pic != element) {
			return false;
		}
	}
	
	return true;
}

function shufflePuzzleParts() {
  const puzzleParts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let counter = puzzleParts.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = puzzleParts[counter];
		puzzleParts[counter] = puzzleParts[index];
		puzzleParts[index] = temp;
	}
	return puzzleParts;
}

function areNeighbours(firstPicId: string, secondPicId: string) {
  const pics = riddle.getElementsByTagName("img");
  
  for (let i = 0; i < pics.length; i++) {
    if (pics[i].getAttribute("id") == firstPicId) {
      const neighbourIdxs = getNeighbourIdxs(i);
      for (let j = 0; j < neighbourIdxs.length; j++) {
        if (pics[neighbourIdxs[j]].getAttribute("id") == secondPicId) {
          return true;
        }
      }
    }
  }
  return false;
}

function swapParts() {
  const pics = riddle.getElementsByTagName("img");
	let pic1 = null;
	
  // loop through parts
  for (let i = 0; i < pics.length; i++) {
    if (pics[i].style.opacity == "0.6") {
      if (pic1 == null) {
        pic1 = document.getElementById(pics[i].getAttribute("id")!);
        continue;
      }
      
      let pic2 = document.getElementById(pics[i].getAttribute("id")!)!;
      
      //swap pictures (swap their properties)
      const pic1Source = pic1.getAttribute("src")!;
      const pic1Alt = pic1.getAttribute("alt")!;
      const pic1Id = pic1.getAttribute("id")!;

      const pic2Source = pic2.getAttribute("src")!;
      const pic2Alt = pic2.getAttribute("alt")!;
      const pic2Id = pic2.getAttribute("id")!;
 
      pic1.setAttribute("src", pic2Source);
      pic1.setAttribute("alt", pic2Alt);
      pic1.setAttribute("id", pic2Id);

      pic2.setAttribute("src", pic1Source);
      pic2.setAttribute("alt", pic1Alt);
      pic2.setAttribute("id", pic1Id);
      
      if (isSolved()) {
        let solved = document.createElement("div");
        solved.id = "solved";
        
        const linkText = document.createTextNode("SOLVED :)");
        solved.appendChild(linkText);
        riddle.appendChild(solved); 
      }
      
      break;
    }
  }
}

function resetOpacity() {
  const pics = riddle.getElementsByTagName("img");

  for (let i = 0; i < pics.length; i++) {
    if (pics[i].style.opacity == "0.6") {
      pics[i].style.opacity = "1.0";
    }
  }
}

function getNeighbourIdxs(currentIdx: number) {
  const returnIdxs: number[] = [];

  // upperNeighbourIdx
  if (isNeighbourIndexCol(currentIdx - 3)) {
    returnIdxs.push(currentIdx - 3);
  }
  // rightNeighbourIdx
  if (isNeighbourIndexRow(currentIdx, currentIdx + 1)) {
    returnIdxs.push(currentIdx + 1);
  }
  // lowerNeighbourIdx
  if (isNeighbourIndexCol(currentIdx + 3)) {
    returnIdxs.push(currentIdx + 3);
  }
  // leftNeighbourIdx
  if (isNeighbourIndexRow(currentIdx, currentIdx - 1)) {
    returnIdxs.push(currentIdx - 1);
  }
  
  return returnIdxs;
}

function isNeighbourIndexRow(currentIdx: number, checkIdx: number) {
  return (Math.max(-1, checkIdx) > -1) &&
    (Math.min(9, checkIdx) < 9) &&
    (Math.floor(currentIdx / 3) == Math.floor(checkIdx / 3));
}

function isNeighbourIndexCol(checkIdx: number) {
  return (Math.max(-1, checkIdx) > -1) &&
    (Math.min(9, checkIdx) < 9);
}
