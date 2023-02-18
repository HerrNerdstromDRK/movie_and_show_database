import React from "react";
import { useLoaderData, useNavigation, Link } from "react-router-dom";

/**
 * Component to display all inventory items. Uses the external
 * inventoryItemsLoader function to retrieve the items from the backend.
 * @returns
 */
export default function HDMoviesAndShows() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const hdFiles = useLoaderData();
  const navigation = useNavigation();

  //  console.log("InventoryItems> inventoryItems: " + JSON.stringify(inventoryItems));
  // The proper method to handle slow loader functions is with Response/Await
  // I was able to get it working, but it became noisy when there were no
  // delays. Go figure.
  if (navigation.state === "Loading") {
    return <h1> Loading... </h1>;
  }

  if (0 === hdFiles.length) {
    // No inventory items to show.
    return (
      <div className="inventoryitems">
        <h2>HD Files</h2>
        <p>No items to show.</p>
      </div>
    );
  } else {
    return (
      <div className="inventoryitems">
        <h2>HD Files</h2>
        {hdFiles.map((hdFile) => (
          <>
            <p>Movie or Show Name: {hdFile.name}</p>
          </>
        ))}
      </div>
    );
  }
}
