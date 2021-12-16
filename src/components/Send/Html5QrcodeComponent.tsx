import React from 'react'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect } from 'react'

const qrcodeRegionId = 'html5qr-code-full-region'

const Html5QrcodeComponent = (props: any): JSX.Element => {


  useEffect(() => {
    // Creates the configuration object for Html5QrcodeScanner.
    const config = createConfig(props)
    const verbose = props.verbose === true

    // Suceess callback is required.
    if (!(props.qrCodeSuccessCallback )) {
      throw 'qrCodeSuccessCallback is required callback.'
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose,
    )

    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    )

    //onUnmout
    return () => {
      html5QrcodeScanner.clear()
        .catch((error:any)=> {
          console.error(
            'Failed to clear html5QrcodeScanner.',
            error,
          )
        })
    }
  }, [])

  return (
    <div id={qrcodeRegionId} >
      safasdfasd f asdf asd fasdf asddf
    </div>
  )
}

const createConfig = (p: any): any => {
  const config: any= {}
  if (p.fps) {
    config.fps = p.fps
  }
  if (p.qrbox) {
    config.qrbox = p.qrbox
  }
  if (p.aspectRatio) {
    config.aspectRatio = p.aspectRatio
  }
  if (p.disableFlip !== undefined) {
    config.disableFlip = p.disableFlip
  }
  return config
}

export default Html5QrcodeComponent
