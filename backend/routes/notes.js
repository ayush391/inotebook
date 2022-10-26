const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const NotesModel = require('../models/Notes');


//fetch all the notes for the user
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const notes = await NotesModel.find({ user: req.user.id });
    res.json(notes);
})

//create a new note
router.post('/addnote', fetchuser, [
    body("title", 'Enter a valid name').isLength({ min: 3 }),
    body("description", 'Enter a valid email').isLength({ min: 3 }),
], async (req, res) => {
    try {
        //check if note is valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }

        //save note
        const note = await NotesModel.create({
            user:req.user.id,
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            date: req.body.date
        });
        note.save();

        return res.status(200).json({ sucess: "note added successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "there was an error adding the note", reason: error });
    }
})

//edit a note
router.put('/editnote/:id', fetchuser, async (req, res) => {
    try {
        //create a temp note and add only the data to be updated to it
        const newNote = {};
        if (req.body.title) { newNote.title = req.body.title };
        if (req.body.description) { newNote.description = req.body.description };
        if (req.body.tag) { newNote.tag = req.body.tag };

        //check if note exists in db
        let note = await NotesModel.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "note not found" });
        }
        
        //check if note belongs to the user or not
        if (note.user.toString() !== req.user.id) {
            return res.status(400).json({ error: "access denied" });
        }
        
        //update the note
        note = await NotesModel.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});

        return res.status(200).json({ sucess: "note updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "there was an error updating the note"});
    }
})

//delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {        
        //check if note exists in db
        let note = await NotesModel.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "note not found" });
        }
        
        //check if note belongs to the user or not
        if (note.user.toString() !== req.user.id) {
            return res.status(400).json({ error: "access denied" });
        }
        
        //update the note
        note = await NotesModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ sucess: "note deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: "there was an error deleting the note"});
    }
})

module.exports = router