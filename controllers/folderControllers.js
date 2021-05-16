const express = require('express');

const fs = require('fs');
const path = require('path');

const stringData = fs.readFileSync(path.join(__dirname, '../folders.json'), 'utf8');
// console.log(stringData); // string
const foldersData = JSON.parse(stringData); // json data

// Get all folders
const getAll = (req, res) => {
	if (foldersData.length > 0) {
		res.status(200);
		res.json(foldersData);
	} else {
		res.status(404);
		res.json({error: "No data exists"});
	}
}

// Get single folder by id
const getSingle = (req, res) => {
	const singleData = foldersData.find(t => t._id === req.params.id);
	if (singleData) {
		res.status(200);
		res.json(singleData);
	} else {
		res.status(404);
		res.json({error: "No such folder"});
	}
}

// Insert a folder
const insertFodler = (req, res) => {
	let id = foldersData.length + 1;
	let children = [];
	
	let new_folder_body = {
		"_id": String(id),
		"name": req.body.name,
		"parent_id": req.body.parent_id,
		"children": children
	}
	
	// console.log(req.body);
	foldersData.push(new_folder_body);
	updateParentFolder(req, res, id, req.body.parent_id);

	fs.writeFile(
		path.join(__dirname, '../folders.json'), 
		JSON.stringify(foldersData, null, 4), 
		(err) => {
			if (err) {
				console.log(err);
				res.status(500);
				res.json({error: "Server could not update the folder"});
			}
			else {
				res.status(200);
				res.json(new_folder_body);
			}
		}
	);
}

// Update a folder
const updateParentFolder = (req, res, id, parent_id) => {
	// console.log('Updating Parent Folder');
	const folderToUpdate = foldersData.find(obj => obj._id === parent_id);
	folderToUpdate.children.push(id);
	// console.log(folderToUpdate);
}

// Delete a folder
const deleteFolder = (req, res) => {
	
	const folder_to_delete = foldersData.find(obj => obj._id === req.body.id);
	const index = foldersData.indexOf(folder_to_delete);
	
	if (id == 1) {
		res.status(404);
		res.json({error: "Root folder cannot be deleted"});
		return 1;
	}

	if(index !== -1) {
		foldersData.splice(index, 1);
		fs.writeFile(
			path.join(__dirname, '../folders.json'), 
			JSON.stringify(foldersData, null, 4), 
			(err) => {
				if (err) {
					console.log(err);
					res.status(500);
					res.json({error: "Server could not update the folder"});
				}
				else {
					res.status(200);
					res.json(foldersData);
				}
			}
		);
	} else {
		res.status(404);
		res.json({error: "No such folder exists to delete"})
	}
}









module.exports = { getAll, getSingle, insertFodler, deleteFolder };