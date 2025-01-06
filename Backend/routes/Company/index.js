import express from 'express';
import { uploadImage } from '../../Controller/filesuploading/index.js';
import { addCompany, getOneCompany, updateOneCompany, getcompanybyuserId, getsearchedCompanies } from '../../Controller/Company/index.js';
import { authMiddleware } from '../../middleware/confirmuser.js'
const router = express.Router();

router.post('/addcompany', uploadImage.single('profilePic'), addCompany)
router.get('/getonecompany/:id', getOneCompany)
router.get('/getcompanybyuserid/:id', getcompanybyuserId)
router.put('/updateonecompany', uploadImage.single('profilePic'), updateOneCompany);
router.get('/getfewcompanies/:query', getsearchedCompanies);
export default router;

