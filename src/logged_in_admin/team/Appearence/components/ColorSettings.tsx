import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ColorPalette } from "../data/data";
import { useAppContext } from "../../../../shared/functions/Context";

const ColorSettings = observer(() => {
    const { api, store } = useAppContext();
    const colors = store.settings.theme?.colors;

    const [primary, setPrimary] = useState(colors?.primary ?? "");
    const [secondary, setSecondary] = useState(colors?.secondary ?? "");
    const [accent, setAccent] = useState(colors?.accent ?? "");

    const update = async(value: any) => {
       await api.settings.create({ ...value })
    }

    return (
        <div style={{ height: "100%" }}>
            <h4 style={{ fontWeight: "500" }}>Choose your primary color</h4>
            <div className="color-pallette">
                {(!ColorPalette.includes(primary) && !!primary) &&
                    <div className="c-p" style={{ backgroundColor: primary, outline: `1px solid ${primary}`, outlineOffset: "2px" }} onClick={() => { setPrimary(primary); update({ colors: { primary } }) }}>
                        {
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                    fill="currentColor"
                                />
                            </svg>}
                    </div>}
                {
                    ColorPalette.map((color, key) => (
                        <div className="c-p" key={key} style={{ backgroundColor: color, outline: color === primary ? `1px solid ${color}` : "", outlineOffset: "2px" }} onClick={() => { update({ colors: { primary: color } }); setPrimary(color) }}>
                            {color === primary &&
                                <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                        fill="currentColor"
                                    />
                                </svg>}
                        </div>
                    ))
                }
                {
                    <div className="c-p" uk-tooltip="Pick a color">
                        <input type="color" id="picColor" name="picColor" onChange={(e) => { setPrimary(e.target.value); update({ colors: { primary: e.target.value } }) }} />
                    </div>
                }
            </div>



            <h4 style={{ fontWeight: "500" }}>Choose your secondary color</h4>
            <div className="color-pallette">
                {(!ColorPalette.includes(secondary) && !!secondary) &&
                    <div className="c-p" style={{ backgroundColor: secondary, outline: `1px solid ${secondary}`, outlineOffset: "2px" }} onClick={() => { setSecondary(secondary); }}>
                        {
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                    fill="currentColor"
                                />
                            </svg>
                        }
                    </div>
                }
                {
                    ColorPalette.map((color, key) => (
                        <div className="c-p" key={key} style={{ backgroundColor: color, outline: color === secondary ? `1px solid ${color}` : "", outlineOffset: "2px" }} onClick={() => { setSecondary(color); update({ colors: { secondary: color } }) }}>
                            {color === secondary &&
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                        fill="currentColor"
                                    />
                                </svg>}
                        </div>
                    ))
                }
                {
                    <div className="c-p" uk-tooltip="Pick a color">
                        <input type="color" id="picColor" name="picColor" onChange={(e) => { setSecondary(e.target.value); update({ colors: { secondary: e.target.value } }) }} />
                    </div>
                }
            </div>




            <h4 style={{ fontWeight: "500" }}>Choose your accent color</h4>
            <div className="color-pallette">
                {(!ColorPalette.includes(accent) && !!accent) &&
                    <div className="c-p" style={{ backgroundColor: accent, outline: `1px solid ${accent}`, outlineOffset: "2px" }} onClick={() => { setAccent(accent); update({ colors: { accent } }) }}>
                        {
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                    fill="currentColor"
                                />
                            </svg>}
                    </div>}
                {
                    ColorPalette.map((color, key) => (
                        <div className="c-p" key={key} style={{ backgroundColor: color, outline: color === accent ? `1px solid ${color}` : "", outlineOffset: "2px" }} onClick={() => { update({ colors: { accent: color } }); setAccent(color) }}>
                            {color === accent &&
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                                        fill="currentColor"
                                    />
                                </svg>}
                        </div>
                    ))
                }
                {
                    <div className="c-p" uk-tooltip="Pick a color">
                        <input type="color" id="picColor" name="picColor" onChange={(e) => { setAccent(e.target.value); update({ colors: { accent: e.target.value } }) }} />
                    </div>
                }
            </div>
        </div>
    );
});


export default ColorSettings;