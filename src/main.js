
async function upload() {
  if (fileToUpload.files.length) {
    const file = new FormData();
    file.append('file', fileToUpload.files[0]);
    const response = await fetch('upload', {
      method: 'POST',
      body: file,
    });

    if (response.ok) {
      const content = await response.json();
      if (content.file.length === 0 || content.line.length === 0) {
        outputError('No files in the database to check');
      } else {
        overallPlag(content.file, content.line);
      }
    } else {
      console.log('failed');
    }
  } else {
    outputError('No File selected');
  }
}

async function overallPlag(fileData, lineData) {
  console.log(fileData, lineData);
  const userFileName1 = document.querySelector('#userFileName1');
  const userFileName2 = document.querySelector('#userFileName2');
  const plagPercent = document.querySelector('#overallPlagPercent');
  const filesCompared = document.querySelector('#numberCompared');
  const reportArea = document.querySelector('#reportArea');

  let fileCounter = 0;
  let filePercent = 0;
  let linePercent = 0;

  await fileData.forEach(file => {
    filePercent += file.similar;
    fileCounter++;
  });

  await lineData.forEach(file => {
    linePercent += file.similar;
  });

  filePercent = filePercent / fileCounter;
  linePercent = linePercent / fileCounter;

  const overallPercent = Math.round(((filePercent + linePercent) * 100) / 2);

  userFileName1.textContent = fileData[0].filename1;
  userFileName2.textContent = fileData[0].filename1;
  plagPercent.textContent = `${overallPercent}%`;
  filesCompared.textContent = `${fileCounter}`;

  reportArea.classList.remove('hidden');

  detailedReport(filePercent, linePercent);
}

function detailedReport(filePercent, linePercent) {
  const filePlagPercent = document.querySelector('#filePlagPercent');
  const fileUniquePercent = document.querySelector('#fileUniquePercent');

  const linePlagPercent = document.querySelector('#linePlagPercent');
  const lineUniquePercent = document.querySelector('#lineUniquePercent');

  const fileBar = document.querySelector('.filePlagBar');
  const lineBar = document.querySelector('.linePlagBar');

  filePercent = Math.round(filePercent * 100);
  linePercent = Math.round(linePercent * 100);

  filePlagPercent.textContent = `${filePercent}%`;
  fileUniquePercent.textContent = `${100 - filePercent}%`;

  linePlagPercent.textContent = `${linePercent}%`;
  lineUniquePercent.textContent = `${100 - linePercent}%`;

  fileBar.style.width = `${filePercent * 5}px`;
  lineBar.style.width = `${linePercent * 5}px`;
}

function moreDetail() {
  const moreDetailBtn = document.querySelector('#detailedReportArea');
  moreDetailBtn.classList.remove('hidden');
}


function showFiles() {
  const fileText = document.querySelector('#fileName');
  fileText.textContent = `File: ${fileToUpload.files[0].name}`;
}

function outputError(data) {
  const errorText = document.querySelector('#fileName');
  errorText.textContent = data;
}

function handleData(e) {
  e.preventDefault();
  fileToUpload.files = e.dataTransfer.files;
  showFiles();
}

function dragOverHandler(e) {
  e.preventDefault();
}

const mainArea = document.querySelector('.dropFileArea');
mainArea.addEventListener('dragover', dragOverHandler);
mainArea.addEventListener('drop', handleData);

const fileToUpload = document.querySelector('#fileInput');
fileToUpload.addEventListener('change', showFiles);

const checkPlagBtn = document.querySelector('#checkPlagBtn');
checkPlagBtn.addEventListener('click', upload);

const moreDetailBtn = document.querySelector('#moreDetailBtn');
moreDetailBtn.addEventListener('click', moreDetail);
