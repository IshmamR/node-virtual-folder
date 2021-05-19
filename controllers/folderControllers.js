const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folders');


// Get all folders
const getAll = (req, res) => {
	Folder.find()
		.exec()
		.then(docs => {
			// console.log('All docs from DB: '+docs);
			if(docs) res.status(200).json(docs);
			else res.status(404).json({ error: "No data found." });
		})
		.catch(err => {
			// console.log(err);
			res.status(500).json({ error: err });
		});
}

// Get single folder by id
const getSingle = (req, res) => {
	const id = req.params.id;
	Folder.findById(id)
		.exec()
		.then(doc => {
			// console.log("From DB: "+doc);
			if(doc) res.status(200).json(doc);
			else res.status(404).json({ error: "Not a valid Id" });
		})
		.catch(err => {
			// console.log(err);
			res.status(500).json({ error: err });
		});
}

// Insert a folder
const insertFolder = (req, res) => {
	let children = [];
	
	// mongoose object
	const folder = new Folder({
		name: req.body.name,
		root: false,
		parent_id: req.body.parent_id,
		// root: true, parent_id: "no_ne", // For root folder
		children: children
	});

	folder.save()
		.then(result => {
			updateParentFolder(req, res, result._id, result.parent_id, 'inserted');
			res.status(200).json({
				message: "Handling POST request to /folders",
				createdFolder: result
			});
		}).catch(err => {
			// console.log(err);
			res.status(500).json({ error: "Could not post the folder" });
		});
}

// Delete a folder
const deleteFolder = (req, res) => {
	var folder_to_delete;

	Folder.findById(req.body.id)
		.exec()
		.then(doc => {
			if(doc) {
				folder_to_delete = doc;
				
				if(doc.parent_id !== 'no_one' && !doc.root) {
					Folder.remove({_id: req.body.id})
						.exec()
						.then(result => {
							updateParentFolder(req, res, doc._id, doc.parent_id, 'deleted');
							deleteChildrenFolders(doc._id, doc.children);
							
							res.status(200).json({
								message: "Handling DELETE request to /folders",
								deletedFolder: result
							});
						})
						.catch(err => res.status(500).json({ error: err }) );
				} 
				else res.status(404).json({ error: "Cannot delete ROOT folder!" });
			}
			else res.status(404).json({ error: "Not a valid Id" });
		})
		.catch(err => res.status(500).json({ error: err }) );
}

// Update parent folder
const updateParentFolder = (req, res, id, parent_id, func) => {
	
	var child_array;
	Folder.findById(parent_id)
		.exec()
		.then(doc => {
			child_array = doc.children;
			// console.log(child_array);

			if (func === 'inserted') {
				child_array.push(id);
				// console.log(child_array);
				Folder.update({ _id: parent_id }, { $set: { children: child_array } })
					.exec()
					.then(result => console.log("Updated parent after posting Folder:"+ id) )
					.catch(err => console.log(err) );
			}
			else if (func === 'deleted') {
				const index = child_array.indexOf(id);
				child_array.splice(index, 1);
				// console.log('Children: '+ child_array);
				Folder.where({ _id: parent_id }).update({ children: child_array })
					.exec()
					.then(result => console.log("Updated parent after deleting Folder:"+ id) )
					.catch(err => console.log(err) );
			}
		})
		.catch(err => console.log(err) );
}
// Delete children folders (Only if deleted folder)
const deleteChildrenFolders = (id, children_array) => {
	Folder.deleteMany({ parent_id: id })
		.exec()
		.then(result => {
			console.log('Children of Folder:'+ id +' deleted');
		})
		.catch(err => console.log(err) );
}


module.exports = { getAll, getSingle, insertFolder, deleteFolder };