import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";

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
      <div className="inventoryitems">
        <h2>Movie And Show Info</h2>
        {movieAndShowInfo.map((movieAndShowInfoFile) => (
          <>
            <p>Movie or Show Name: {movieAndShowInfoFile.name}</p>
            <p>
              {movieAndShowInfoFile.correlatedFilesList.map((correlatedFile) =>
                correlatedFile.mkvFilesByName.map((mkvFileName) => (
                  <p>mp4file: {mkvFileName}</p>
                ))
              )}
            </p>
            <p>
              {movieAndShowInfoFile.correlatedFilesList.map((correlatedFile) =>
                correlatedFile.mp4FilesByName.map((mp4FileName) => (
                  <p>mp4file: {mp4FileName}</p>
                ))
              )}
            </p>
          </>
        ))}
      </div>
    );
  }
}
