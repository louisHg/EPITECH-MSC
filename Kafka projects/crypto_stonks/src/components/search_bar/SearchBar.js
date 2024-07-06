import React from "react";
import "./SearchBar.css"

export default function SearchBar({ value, onChange }) {
    return <div className="input-field outlined valign-wrapper"
        style={{
            margin: "auto",
            width: "70%",
            borderRadius: 10,
            border: "thin solid #707070",
            height: "fit-content",
            lineHeight: 4,
            marginBottom: 10
        }}
    >
        <input className="messenger-input"
            style={{ paddingBlock: 0, border: "none", borderRadius: 25, height: 35, flex: 1 , marginBottom: 0}}
            type="text"
            placeholder="  Rechercher une cypto"
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}>
        </input>
        <i className="material-icons grey-text text-darken-2" style={{ marginInline: 10, color: "black" }}>search</i>
    </div>
}