import React, { useState } from 'react'
import axios from 'axios'

const KEY = '22b746e8df0bdad6793499fea7d5bf25'
const offset = 100

export default (props) => {
    let [city, changeCity] = useState([
        {
            label: '西安',
            value: "6101"
        },
        {
            label: '北京',
            value: 'beijing'
        },
        {
            label: '上海',
            value: 'shanghai'
        },
        {
            label: '广州',
            value: 'guangzhou'
        },
        {
            label: '深圳',
            value: 'shenzhen'
        },
        {
            label: '成都',
            value: 'chengdu'
        }
    ])
    let [curCity, changeCurCity] = useState('beijing')
    let [kw, changeKw] = useState('大学')
    let [kwResult, changeKwResult] = useState([])
    let [curResult, changeCurResult] = useState(-1)
    let [distance, changeDistance] = useState([
        {
            label: '一公里',
            value: 1000
        },
        {
            label: '二公里',
            value: 2000
        },
        {
            label: '三公里',
            value: 3000
        }
    ])
    let [curDistance, changeCurDis] = useState(1000)
    let [rangeResult, changeRangeResult] = useState([])
    let [rangeSearchType, changeRangeSearchType] = useState('酒店')
    const onInputChange = (e) => {
        changeKw(e.target.value)
    }
    const onSelectChange = (e) => {
        changeCurCity(e.target.value)
    }
    const onSearch = () => {
        axios.get(`https://restapi.amap.com/v3/place/text?city=${curCity}&keywords=${kw}&offset=${offset}&key=${KEY}`).then(res => {
            changeKwResult(res.data.pois)
            changeRangeResult([])
        })
    }
    const rangeSearch = () => {
        let location = kwResult[curResult].location
        axios.get(`https://restapi.amap.com/v3/place/around?location=${location}&radius=${curDistance}&keywords=${rangeSearchType}&offset=${offset}&key=${KEY}`).then(res => {
            
            changeRangeResult(res.data.pois)
        })
    }
    return (
        <div>
            <div>
                <select value={curCity} onChange={onSelectChange}>
                    {
                        city.map((item, index) => {
                            return (
                                <option key={index} value={item.value}>{item.label}</option>
                            )
                        })
                    }
                </select>
                <input type="text" value={kw} onChange={onInputChange} />
                <button onClick={onSearch}>search</button>
            </div>
            <div className="distanceRes">
                <div className="kwResult">
                    <ul>
                        {
                            kwResult.map((item, index) => {
                                return (
                                    <li key={index} onClick={()=>{
                                        changeCurResult(index)
                                    }}>
                                        <div>
                                            {`${item.name}: ${item.location}`}
                                        </div>
                                        {
                                            curResult === index ? (
                                                <div>
                                                    <select value={rangeSearchType} onChange={(e)=>{
                                                        changeRangeSearchType(e.target.value)
                                                    }}>
                                                        <option value="酒店">酒店</option>
                                                        <option value="大学">大学</option>
                                                        <option value="小区">小区</option>
                                                        <option value="公园">公园</option>
                                                    </select>
                                                    <select value={curDistance} onChange={(e) => {
                                                        changeCurDis(e.target.value)
                                                    }}>
                                                        {
                                                            distance.map((item, index) => {
                                                                return <option key={index} value={item.value}>{item.label}</option>
                                                            })
                                                        }
                                                        <option></option>
                                                    </select>
                                                    <button onClick={rangeSearch}>范围搜索</button>
                                                </div>
                                            ) : null
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="rangeResult">
                        <ul>
                            {
                                rangeResult.map((item,index)=>{
                                    return (
                                        <li key={index}>{`${item.name}: ${item.location}`}</li>
                                    )
                                })
                            }
                        </ul>
                </div>
            </div>
        </div>
    )
}