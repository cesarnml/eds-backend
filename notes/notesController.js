const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

const notesControllers = {
  getNotes(req, res, next) {
    db("notes")
      .then(notes => {
        if (!notes.length) {
          console.log("notes.length = ", notes.length);
          next();
        }
        res.status(200).json(notes);
      })
      .catch(() => next(new Error("Could not get Notes")));
  },

  async getANote(req, res, next) {
    try {
      const noteID = req.params.id;

      const selectedNote = await db("notes").where("notes.id", noteID);

      selectedNote.length
        ? res.status(200).json(selectedNote[0])
        : res
            .status(404)
            .json({ errorMessage: "A note with that ID could not be found." });
    }
    catch (err) {
      next(new Error("Could not get Notes"))
      // res
      //   .status(500)
      //   .json({ error: "The note information could not be retrieved.", err });
    }
  },

  createNote(req, res, next) {
    const newNote = req.body;
    db("notes")
      .insert(newNote)
      .then(note => {
        if (!note) {
          next();
        }
        res.status(200).json(note);
      })
      .catch(() => next(new Error("Could not create a new Notes")));
  }
};

module.exports = notesControllers;