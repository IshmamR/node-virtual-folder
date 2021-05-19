const express = require('express');
const router = express.Router();

const { getAll, getSingle, insertFolder, deleteFolder } = require('../../controllers/folderControllers.js');

// Get all folders
router.get('/', getAll);

// Get specific folder
router.get('/:id', getSingle);

// Post(create) a fodler
router.post('/', insertFolder);

// Delete a folder
router.delete('/', deleteFolder)

module.exports = router;