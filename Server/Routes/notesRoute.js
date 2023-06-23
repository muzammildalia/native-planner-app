import express from 'express';

import { getNotesController } from '../Controllers/notesController.js';




const router = express.Router()




router.get("/notes", getNotesController);




export default router;