
async function upload(files) {
  console.log(files);
  for (const file of files) {
    const opts = {
      method: 'POST',
      body: new FormData(),
    };
    opts.body.append('test', file, file.name);

    try {
      const response = await fetch('/upload', opts);
      if (response.ok) {
        const data = await response.json();
        console.log('received');
        outputData(data);
      } else {
        console.log('Error');
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  }
}

function handleData(e) {
  e.preventDefault();
  upload(e.dataTransfer.files);
  console.log('upload');
  console.log(e.dataTransfer.files);
}

function outputData(data) {
  const output = document.querySelector('#outputText');
  console.log('Data: ', data);
  output.textContent = data;
}


function dragOverHandler(e) { e.preventDefault(); }

const mainArea = document.querySelector('#dragArea');

mainArea.addEventListener('dragover', dragOverHandler);
mainArea.addEventListener('drop', handleData);
