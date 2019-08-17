import React from 'react'
import {Link} from 'react-router-dom'

export default (props)=>{
    return (
        <div>
            <details open>
                <summary>
                    exif
                </summary>
            </details>
            <dl>
                <dd>
                    <Link to="/exif/address">address</Link>
                </dd>
            </dl>
            <details open>
                <summary>
                    map
                </summary>
            </details>
            <dl>
                <dd>
                    <Link to="/map/distance">distance</Link>
                </dd>
            </dl>
        </div>
    )
}