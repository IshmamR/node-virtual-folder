const { MONGO_PASS } = require('./credentials');

const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folders');

const dbURI = `mongodb+srv://ishmam:${MONGO_PASS}@ishita.oa6bd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => handleUpdate())
	.catch(error => console.log(error));

function handleUpdate() {
	// createRootFolder();

	updateRootFolder();

	/** WARNING **/
	// deleteRootFolder(); 
}

function createRootFolder() {
	let children = [];

	const folder = new Folder({
		name: "Folder 1", 
		root: true, 
		parent_id: "no_ne", 
		children: children
	});
	folder.save()
		.then(result => console.log(result) )
		.catch(err => console.log(err) );
}

function updateRootFolder() {
	let child_array = [];
	Folder.update({ root: true }, { $set: { children: child_array } })
		.exec()
		.then(result => console.log(result) )
		.catch(err => console.log(err) );
}

function deleteRootFolder() {
	// codes...
}