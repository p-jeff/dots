import React, { useState } from "react";
import './index.css'
import App from "./visualizer";

export default function SplashScreen() {

    const [menu, setMenu] = useState(true)

    const clickHandler = () => { setMenu(false) }

    return (
        <div className="App">
            {
                menu ? <div className="centerDiv">
                    < button className="button-50" onClick={clickHandler} >
                        Start
                    </button >
                    <h1 className="splashScreen">audiovisual, headphones recomended- 2022 Johannes Felix Lotze @ nicht/nicht </h1>
                </div > :
                    <App />
            }
        </div>
    )
}