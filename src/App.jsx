import { useState } from 'react'
import './App.css'
import CSVEditor from './components/CSVEditor'
import Dropzone from 'react-dropzone'

function App() {
  const [importedFile, setImportedFile] = useState([]);
  console.log(importedFile)
  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles) => setImportedFile(acceptedFiles)}
        accept={".csv"}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone">
            <div
              className="dz-message needsclick"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <i className="h3 text-muted dripicons-cloud-upload"></i>
              <h5>Drop files here or click to upload.</h5>
            </div>
          </div>
        )}
      </Dropzone>
      <CSVEditor importedFile={importedFile?.length ? importedFile[importedFile?.length - 1] : []} />
    </>
  )
}

export default App
