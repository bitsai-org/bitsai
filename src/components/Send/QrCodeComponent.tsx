import React, {useEffect} from 'react'

import QrScanner from 'qr-scanner'
//import qrScannerWorkerSource from '!!raw-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js'
//
// eslint-disable-next-line import/no-webpack-loader-syntax
const qrScannerWorkerSource: any = require('!!raw-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js')
console.log(QrScanner.WORKER_PATH)
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource]))


const QrCodeComponent = (): JSX.Element => {
  const vidElem  = document.getElementById('qrscanner-vid') as HTMLVideoElement

  useEffect(() => {
    const qrScanner = new QrScanner(
      vidElem,
      result => console.log('decoded qr code:', result)
    )

    qrScanner.start()
  }, [])

  return (
    <>
      <video
        id="qrscanner-vid"
        style={{
          width: '20rem'
        }}
      >
      </video>
    </>
  )
}

export default QrCodeComponent
