import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";

/**
 * Component to display all inventory items. Uses the external
 * inventoryItemsLoader function to retrieve the items from the backend.
 * @returns
 */
export default function MovieAndShowInfo() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const movieAndShowInfo = useLoaderData();
  const navigation = useNavigation();

  //  console.log("InventoryItems> inventoryItems: " + JSON.stringify(inventoryItems));
  // The proper method to handle slow loader functions is with Response/Await
  // I was able to get it working, but it became noisy when there were no
  // delays. Go figure.
  if (navigation.state === "Loading") {
    return <h1> Loading... </h1>;
  }

  if (0 === movieAndShowInfo.length) {
    // No inventory items to show.
    return (
      <div className="inventoryitems">
        <h2>Missing Files</h2>
        <p>No items to show.</p>
      </div>
    );
  } else {
    return (
      <div>
        <h2>
          <center>Movie And Show Info</center>
        </h2>
        <center>Found {movieAndShowInfo.length} item(s)</center>
        <p></p>
        {movieAndShowInfo.map((movieAndShowInfoFile) => (
          <Grid
            className="movieandshowinfo"
            container
            rowSpacing={2}
            key={movieAndShowInfoFile.name}
          >
            <Grid className="movieandshowinfo-details" xs={12}>
              <center>{movieAndShowInfoFile.name}</center>
            </Grid>
            <Grid className="movieandshowinfo-details" xs={6}>
              {movieAndShowInfoFile.correlatedFilesList.map((correlatedFile) =>
                correlatedFile.mkvFilesByName.map((mkvFileName) => (
                  <center>{mkvFileName}</center>
                ))
              )}
            </Grid>
            <Grid className="movieandshowinfo-details" xs={6}>
              {movieAndShowInfoFile.correlatedFilesList.map((correlatedFile) =>
                correlatedFile.mp4FilesByName.map((mp4FileName) => (
                  <center>{mp4FileName}</center>
                ))
              )}
            </Grid>
          </Grid>
        ))}
      </div>
    );
  }
}
