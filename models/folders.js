const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema ({
	name: {
		type: String,
		required: true
	},
	root: {
		type: Boolean,
		required: true
	},
	parent_id: {
		type: String,
		required: true
	},
	children: [{
		type: String
	}]
});
const Model = mongoose.model('Folder', folderSchema);

module.exports = Model;