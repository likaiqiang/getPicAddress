import React, { useState, useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import loadImage from 'blueimp-load-image'

const App = (props) => {
    let [previewUrl, changePreviewUrl] = useState('')
    let previewRef = useRef(null)
    let [content, changeContent] = useState('')

    const useFile = (initFile) => {
        const [file, changeFile] = useState(null)
        const onChange = useCallback((file) => {
            changeFile(file)
        },[])
        return {
            file,
            onChange
        }
    }
    let { file, onChange } = useFile(null)


    const onFileChange = (e) => {
        let file = e.target.files[0]
        if (file) {
            onChange(e)
            loadImage(file, function (img, data) {
                if (data.exif)
                    dealExif(data.exif.getAll())
                else changeContent('no exif data')

            }, {
                    meta: true
                })

            let url = URL.createObjectURL(file)
            changePreviewUrl(url)
        }
        return 

    }
    const dealExif = (data) => {
        let { GPSLongitude, GPSLatitude } = data //经纬度
        if (GPSLongitude) {
            GPSLongitude = GPSLongitude.split(',')
            GPSLatitude = GPSLatitude.split(',')
            GPSLongitude = GPSLongitude.reduce((acc, item, index) => {
                return acc + Number(item) / (60 ** index)
            }, 0).toFixed(6)

            GPSLatitude = GPSLatitude.reduce((acc, item, index) => {
                return acc + Number(item) / (60 ** index)
            }, 0).toFixed(6)

            axios.get(`https://restapi.amap.com/v3/geocode/regeo?location=${GPSLongitude},${GPSLatitude}&key=22b746e8df0bdad6793499fea7d5bf25&output=JSON`).then(res => {
                changeContent(res.data.regeocode.formatted_address)
            }).catch(err => {

            })
        }
        else {
            changeContent('no gps info')
        }
    }
    return (
        <div>
            <input type="file" onChange={onFileChange}></input>
            <img ref={previewRef} alt={previewUrl}  style={{ width: document.documentElement.clientWidth }} src={previewUrl} />
            <div>{content}</div>
        </div>
    )
}

export default App