import { pool } from '../../Database/database.js';
import multer from 'multer';
import dotenv from 'dotenv';

export const getalljobs = async (req, res) => {
    try {
        const { companyid } = req.params;
        console.log("hellooo");
        if (!companyid) {
            return res.status(401).json({
                success: false,
                message: "companyid is required"
            })
        }
        const selectQuery = 'Select * from jobs where company_id=$1';
        const { rows } = await pool.query(selectQuery, [companyid]);
        if (rows.length === 0) {
            return res.status(406).json({
                success: false,
                message: 'no jobs found for this company'
            })
        }
        return res.status(200).json({
            data: rows,
            success: true,
        })
    } catch (err) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}