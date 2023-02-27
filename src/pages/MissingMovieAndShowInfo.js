import { faCropSimple } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

function getRows(movieAndShowInfoFile) {
  let rows = [];

  movieAndShowInfoFile.correlatedFilesList.forEach((correlatedFile) => {
    let idEntry =
      movieAndShowInfoFile.mkvLongPath !== "(empty)"
        ? movieAndShowInfoFile.mkvLongPath +
          "\\" +
          correlatedFile.fileName +
          ".mkv"
        : movieAndShowInfoFile.mp4LongPath +
          "\\" +
          correlatedFile.fileName +
          ".mp4";

    let newRow = {
      id: idEntry,
      mkvFileName: correlatedFile.mkvFilesByName[0],
      mp4FileName: correlatedFile.mp4FilesByName[0],
      action: "None",
      fileName: correlatedFile.fileName,
      missingMKVFile: correlatedFile.missingMKVFile,
      missingMP4File: correlatedFile.missingMP4File,
    };
    rows.push(newRow);
  });
  return rows;
}

/**
 * Component to display all inventory items. Uses the external
 * inventoryItemsLoader function to retrieve the items from the backend.
 * @returns
 */
export default function MissingMovieAndShowInfo() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const movieAndShowInfo = useLoaderData();
  const navigation = useNavigation();

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
          <div className="movieandshowinfo-details">
            <h3>
              <center>{movieAndShowInfoFile.movieOrShowName}</center>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>MKV File</th>
                  <th>MP4 File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getRows(movieAndShowInfoFile).map((theRow) =>
                  getRow(theRow, movieAndShowInfoFile)
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
}

function getRow(theRow, movieAndShowInfoFile) {
  return (
    <tr key={theRow.id}>
      <td key={movieAndShowInfoFile.mkvLongPath + "\\" + theRow.mkvFileName}>
        {theRow.mkvFileName}
      </td>
      <td key={movieAndShowInfoFile.mp4LongPath + "\\" + theRow.mp4FileName}>
        {theRow.mp4FileName}
      </td>
      <td>
        <center>
          {theRow.missingMKVFile ? (
            <Form method="PUT">
              <button
                name="mkvButtonName"
                value={JSON.stringify(movieAndShowInfoFile)}
                type="submit"
              >
                Make fake MKV File
              </button>
            </Form>
          ) : theRow.missingMP4File ? (
            <Form method="POST">
              <button
                name="mp4ButtonName"
                value={
                  movieAndShowInfoFile.movieOrShowName + "." + theRow.fileName
                }
                type="submit"
              >
                Transcode File
              </button>
            </Form>
          ) : (
            ""
          )}
        </center>
      </td>
    </tr>
  );
}

/*
                value={[
                  JSON.stringify(movieAndShowInfoFile),
                  JSON.stringify(theRow),
                ]}
*/

export const missingMovieAndShowInfoButtonHandler = async ({
  request,
  params,
}) => {
  switch (request.method) {
    case "PUT": {
      // PUT means adding a request to create a fake mkv file.
      return createFakeMKVJob({ request, params });
    }
    case "POST": {
      // POST means adding a transcode request for a missing mp4 file.
      return addTranscodeJob({ request, params });
    }
    default: {
      // Either failed to delete inventoryItem or failed to find/return the owning
      console.log(
        "missingMovieAndShowInfoButtonHandler> No matching request.method: " +
          request.method
      );
    }
  }
};

const createFakeMKVJob = async ({ request, params }) => {
  //  console.log("createFakeMKVJob> request: " + JSON.stringify(request));
  const formData = await request.formData();
  //  console.log("createFakeMKVJob> formData: " + JSON.stringify(formData));
  const movieAndShowInfoFile = JSON.parse(formData.get("mkvButtonName"));
  console.log(
    "createFakeMKVJob> formData.get(mkvButtonName): " +
      JSON.stringify(formData.get("mkvButtonName"))
  );
  console.log(
    "createFakeMKVJob> movieAndShowInfoFile.movieOrShowName: " +
      movieAndShowInfoFile.movieOrShowName
  );
  //  console.log("createFakeMKVJob> theRow: " + theRow);
  return null;
};

const addTranscodeJob = async ({ request, params }) => {
  console.log("addTranscodeJob> request: " + JSON.stringify(request));
  const formData = await request.formData();
  const testData = formData.get("mp4ButtonName");
  console.log("addTranscodeJob> testData: " + testData);
  return null;
};
