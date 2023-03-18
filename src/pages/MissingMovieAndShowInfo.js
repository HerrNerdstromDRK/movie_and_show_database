//import { faCropSimple } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import api from "../api/axios";

const jobRecordMakeFakeMKVAPI = "/jobrecordmakefakemkv";
const jobRecordTranscodeMKVAPI = "/jobrecordtranscodemkv";
const missingFileSubstituteName = "(none)";

function getRows(movieAndShowInfoFile) {
  let rows = [];

  movieAndShowInfoFile.correlatedFilesList.forEach((correlatedFile) => {
    let idEntry =
      movieAndShowInfoFile.mkvLongPath !== missingFileSubstituteName
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
 * Component to display all missing movies and tv shows. Uses the external
 * missingFileInfoLoader function to retrieve the information from the backend.
 * @returns
 */
export default function MissingMovieAndShowInfo() {
  // Retrieve the pre-loaded database data
  // This will invoke the imported inventoryItemLoader as assigned in App.js
  const movieAndShowInfo = useLoaderData();
  const navigation = useNavigation();

  // TODO: Update the buttons for jobs that have been added
  const actionMessageObject = useActionData();
  const actionMessage = actionMessageObject?.message
    ? actionMessageObject.message
    : "";
  console.log("MissingMovieAndShowInfo> actionMessage: " + actionMessage);

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
                value={JSON.stringify(
                  createMakeFakeOrTranscodeMKVFileButtonObject(
                    movieAndShowInfoFile,
                    theRow
                  )
                )}
                type="submit"
              >
                Make fake MKV File
              </button>
            </Form>
          ) : theRow.missingMP4File ? (
            <Form method="POST">
              <button
                name="mp4ButtonName"
                value={JSON.stringify(
                  createMakeFakeOrTranscodeMKVFileButtonObject(
                    movieAndShowInfoFile,
                    theRow
                  )
                )}
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

/**
 * Create a new object that represents the information needed to
 *  make a fake MKV file for the given movie or tv show and individual
 *  file.
 * @param {} movieAndShowInfoFile
 * @param {*} theRow
 */
function createMakeFakeOrTranscodeMKVFileButtonObject(
  movieAndShowInfoFile,
  theRow
) {
  let makeFakeOrTranscodeMKVFileObject = {
    mkvLongPath: movieAndShowInfoFile.mkvLongPath,
    mp4LongPath: movieAndShowInfoFile.mp4LongPath,
    movieOrShowName_id: movieAndShowInfoFile._id,
    movieOrShowName: movieAndShowInfoFile.movieOrShowName,
    mkvFileName: theRow.mkvFileName,
    fileName: theRow.fileName,
    missingMKVFile: theRow.missingMKVFile,
    missingMP4File: theRow.missingMP4File,
  };
  return makeFakeOrTranscodeMKVFileObject;
}

export const missingMovieAndShowInfoButtonHandler = async ({
  request,
  params,
}) => {
  switch (request.method) {
    case "PUT": {
      // PUT means adding a request to create a fake mkv file.
      return addFakeMKVJob({ request, params });
    }
    case "POST": {
      // POST means adding a transcode request for a missing mp4 file.
      return addTranscodeMKVJob({ request, params });
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

const addFakeMKVJob = async ({ request, params }) => {
  const formData = await request.formData();
  const makeFakeMKVFileObject = JSON.parse(formData.get("mkvButtonName"));

  console.log(
    "addFakeMKVJob> makeFakeMKVFileObject: " +
      JSON.stringify(makeFakeMKVFileObject)
  );
  try {
    await api.post(jobRecordMakeFakeMKVAPI, makeFakeMKVFileObject);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      return { message: "Error: " + err.message };
    } else {
      // No response or non-200 error
      console.log("addFakeMKVJob> Error: " + err.message);
    }
  } // catch()
  return { message: "Successfully updated!" };
};

const addTranscodeMKVJob = async ({ request, params }) => {
  const formData = await request.formData();
  const transcodeMKVFileObject = JSON.parse(formData.get("mp4ButtonName"));

  console.log(
    "addTranscodeMKVJob> transcodeMKVFileObject: " +
      JSON.stringify(transcodeMKVFileObject)
  );
  try {
    await api.post(jobRecordTranscodeMKVAPI, transcodeMKVFileObject);
  } catch (err) {
    if (err.response) {
      // Not in the 200 response range
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      return { message: "Error: " + err.message };
    } else {
      // No response or non-200 error
      console.log("addTranscodeMKVJob> Error: " + err.message);
    }
  } // catch()
  return { message: "Successfully updated!" };
};
