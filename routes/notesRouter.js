const notesRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../utils/fsUtils');

notesRouter.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notesRouter.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

notesRouter.post('/', (req, res) => {
    const { title, text } = req.body;
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
      readAndAppend(newNote, './db/db.json');
      res.json(`note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });

notesRouter.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile('./db/db.json', result);

      
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notesRouter;
