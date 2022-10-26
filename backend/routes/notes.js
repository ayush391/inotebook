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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }

        const note = await NotesModel.create({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            date: req.body.date
        });

        note.save();
        return res.status(200).json({ sucess: "note added successfully" });
    }
    catch(error){
        return res.status(404).json({error: "there was an error adding the note", reason: error});
    }
})

module.exports = router