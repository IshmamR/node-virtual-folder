const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema ({
	title: {
		type: String,
		required: true
	},
	parent: {
		type: String,
		required: true
	},
	child: [{
		type: String
	}]
});
const Model = mongoose.Model('Folder', folderSchema);

module.exports = Model;