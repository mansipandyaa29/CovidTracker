import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
    #go through all of th countries, map through them, for every single country, return the following
      {countries.map((country) => ( 
    #numeral adds commas
        <tr><td>{country.country}</td><td><strong>{numeral(country.cases).format("0,0")}</strong></td></tr>
      ))}
    </div>
  );
}

export default Table;
