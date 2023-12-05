const fs = require("fs/promises");

(async () => {
  const commandFileHandler = await fs.open("./command.txt", "r");

  // Adding an event for file change
  // NOTE: FileHandle objects are EventEmitters! -- therefore, you can add & emit events
  commandFileHandler.on("change", async () => {
    // setting variables for parameters for reading file method:
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer (should be 0)
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0; // should always be 0 (start from the first character!)

    // allocating a buffer of exact size, and reading the whole content (from beg to end)
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8"); // buffer format to string

    // Commands
    const CREATE_FILE = "create file";
    const DELETE_FILE = "delete file";
    const RENAME_FILE = "rename file";
    const ADD_TO_FILE = "add to file";

    // Custom functions for file operations
    // creating a file
    const createFile = async (path) => {
      let existingFileHandle;
      try {
        // checking whether or not we already have the file
        existingFileHandle = await fs.open(path, "r");
        existingFileHandle.close();
        return console.log(`The file ${path} already exists`);
      } catch (err) {
        // we don't have the file, so let's create it
        const newFileHandle = await fs.open(path, "w");
        console.log("A new file was successfully created");
        newFileHandle.close();
      }
    };

    // deleting a file
    const deleteFile = async (path) => {
      try {
        await fs.unlink(path);
        console.log(`Deleting file at ${path} was successful`);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.log("No file at this path to remove.");
        } else {
          // all other errors
          console.log(`An error occurred while removing the file: ${e}`);
        }
      }
    };

    // renaming a file
    const renameFile = async (oldPath, newPath) => {
      try {
        await fs.rename(oldPath, newPath);
        console.log(
          `The file was successfully renamed from ${oldPath} to ${newPath}`
        );
      } catch (e) {
        if (e.code === "ENOENT") {
          console.log(
            "No file at this path to rename or the destination doesn't exist"
          );
        } else {
          // all other errors
          console.log(`An error occurred while renaming the file: ${e}`);
        }
      }
    };

    // add/appending to a file
    const addToFile = async (path, content) => {
      try {
        // opening file for appending
        fs.appendFile(path, content);
        //or, you could do:
        // const fileHandle = await fs.open(path, "a");
        // fileHandle.write(content);
        console.log("content was added successfully!");
      } catch (e) {
        if (e.code === "ENOENT") {
          console.log("No file at this path");
        } else {
          // all other errors
          console.log(`An error occurred while adding to the file: ${e}`);
        }
      }
    };

    // Performing Operations based on text that user types in the command.txt
    // Create a file:  create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
    // Delete a file:  delete a file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }
    // Rename a file:  rename file <path> to <new-path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to "); // index of the starting idx of the string specified
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4); // right where <new-path> starts
      renameFile(oldFilePath, newFilePath);
    }
    // Adding to a file:  add to file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  // Watcher & Emitting events
  const watcher = fs.watch("./command.txt");

  /* async iterator (for await.. of) iterates over async iterable objects, 
    only in contexts where await can be used */
  for await (const event of watcher) {
    if (event.eventType == "change") {
      commandFileHandler.emit("change");
    }
  }
})();
