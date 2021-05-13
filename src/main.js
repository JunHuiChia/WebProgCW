const fileToUpload = document.querySelector('#fileInput');

async function upload() {
  const file = new FormData();
  if (fileToUpload.files.length) {
    file.append('file', fileToUpload.files[0]);
  }

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

