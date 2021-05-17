const fileToUpload = document.querySelector('#fileInput');

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
      outputData(content);
    } else {
      console.log('failed');
    }
  } else {
    outputData('No File selected');
  }
}

async function getAll() {
  const response = await fetch('getData');
  if (response.ok) {
    const content = await response.json();
    console.log(content);
  } else {
    console.log('dont work');
  }
}

function handleData(e) {
  e.preventDefault();
  fileToUpload.files = e.dataTransfer.files;
}

function outputData(data) {
  const output = document.querySelector('#outputText');
  console.log('Data: ', data);
  output.textContent = data;
}


function dragOverHandler(e) { e.preventDefault(); }

const mainArea = document.querySelector('#fileInput');

mainArea.addEventListener('dragover', dragOverHandler);
mainArea.addEventListener('drop', handleData);

