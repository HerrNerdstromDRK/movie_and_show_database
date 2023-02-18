import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";

/**
 * Component to display all inventory items. Uses the external
 * inventoryItemsLoader function to retrieve the items from the backend.
 * @returns
 */
export default function SDMoviesAndShows() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const sdFiles = useLoaderData();
  const navigation = useNavigation();

  //  console.log("InventoryItems> inventoryItems: " + JSON.stringify(inventoryItems));
  // The proper method to handle slow loader functions is with Response/Await
  // I was able to get it working, but it became noisy when there were no
  // delays. Go figure.
  if (navigation.state === "Loading") {
    return <h1> Loading... </h1>;
  }

  if (0 === sdFiles.length) {
    // No inventory items to show.
    return (
      <div className="inventoryitems">
        <h2>SD Files</h2>
        <p>No items to show.</p>
      </div>
    );
  } else {
    return (
      <div className="inventoryitems">
        <h2>SD Files</h2>
        {sdFiles.map((sdFile) => (
          <>
            <p key={sdFile.name}>Movie or Show Name: {sdFile.name}</p>
          </>
        ))}
      </div>
    );
  }
}
