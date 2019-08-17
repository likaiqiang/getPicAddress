/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import axios from 'axios'
import loadImage from 'blueimp-load-image'

const App = () => {
    let [results, changeResults] = useState([])

    const onFileChange = (e) => {
        let files = e.target.files
        let newResults = []
        for (let k = 0; k < files.length; k++) {
            newResults.push({
                url: '',
                content: ''
            })
        }
        if (files) {
            for (let i = 0; i < files.length; i++) {
                !(function(i){
                    loadImage(files[i], function (img, data) {
                        if (data.exif) {
                            let { GPSLongitude, GPSLatitude } = data.exif.getAll()
                            if (GPSLongitude) {
                                let GPSInfo = dealGps(GPSLongitude, GPSLatitude)
    
                                GPSLongitude = GPSInfo.GPSLongitude
                                GPSLatitude = GPSInfo.GPSLatitude
                                axios.get(`https://restapi.amap.com/v3/geocode/regeo?location=${GPSLongitude},${GPSLatitude}&key=22b746e8df0bdad6793499fea7d5bf25&output=JSON`).then(res=>{
                                    newResults[i].content = res.data.regeocode.formatted_address
                                    changeResults(newResults)
                                })
                            }
                            else {
                                newResults[i].content = 'no gps data'
                                changeResults(newResults)
                            }
                        }
                        else {
                            newResults[i].content = 'no exif data'
                            changeResults(newResults)
                        }
    
                    }, { meta: true })
                    let url = URL.createObjectURL(files[i])
                    newResults[i].url = url
                    changeResults(newResults)
                })(i)
            }
            
        }
        return

    }

    const dealGps = (GPSLongitude, GPSLatitude) => {
        GPSLongitude = GPSLongitude.split(',')
        GPSLatitude = GPSLatitude.split(',')
        GPSLongitude = GPSLongitude.reduce((acc, item, index) => {
            return acc + Number(item) / (60 ** index)
        }, 0).toFixed(6)

        GPSLatitude = GPSLatitude.reduce((acc, item, index) => {
            return acc + Number(item) / (60 ** index)
        }, 0).toFixed(6)
        return {
            GPSLongitude,
            GPSLatitude
        }
    }
    return (
        <div>
            <input type="file" multiple={true} accept="image/gif, image/jpeg, image/jpg, image/png" onChange={onFileChange}></input>
            <ul className="results">
                {
                    results.map((item, index) => {
                        return (
                            <li key={index} onClick={()=>{
                                alert(item.content)
                            }}>
                                <img alt={item.url} style={{ width: '20%' }} src={item.url} />
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default App