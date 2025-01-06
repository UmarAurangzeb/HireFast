import { pool } from '../../Database/database.js';
import multer from 'multer';
import dotenv from 'dotenv';
export const addCompany = async (req, res) => {
    try {
        const { company_name, description, website, employer_id } = req.body;
        const imageUrl = req.file?.location || req.body.imageUrl || null;
        // console.log(imageUrl);

        if (!company_name || !description) {
            return res.status(400).json({
                message: "Company name or description missing",
            });
        }
        let insertQuery, queryParams;

        if (website) {
            insertQuery = `INSERT INTO company (company_name, description, website, imageUrl,employer_id) VALUES ($1, $2, $3, $4,$5) RETURNING *`;
            queryParams = [company_name, description, website, imageUrl, employer_id];
        } else {
            insertQuery = `INSERT INTO company (company_name, description, imageUrl,employer_id) VALUES ($1, $2, $3,$4) RETURNING *`;
            queryParams = [company_name, description, imageUrl, employer_id];
        }
        const result = await pool.query(insertQuery, queryParams);

        if (result.rowCount === 0) {
            return res.status(400).json({
                message: "error updating company data",
                success: false
            })
        }

        return res.status(201).json({
            message: "Company added successfully",
            data: result.rows[0]
        });
    } catch (e) {
        console.error("Error inserting company:", e);
        return res.status(500).json({
            message: "Error adding company",
            error: e.message,
        });
    }
}

export const getOneCompany = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id", id);
        console.log("sds");
        if (!id) {
            return res.status(400).json({ message: "Company ID is required" });
        }
        await pool.query('BEGIN');

        const SelectQuery = `
            SELECT 
            c.company_id, 
            c.company_name, 
            c.description, 
            c.website, 
            c.imageurl, 
            c.employer_id,
            c.registered_at,
            -- Select the job-related columns, but alias them to avoid confusion with company columns
            j.job_id,
            j.title,
            j.description AS job_description, 
            j.requirement,
            j.jobtype,
            j.posted_date,
            j.closing_date,
            j.status
            FROM company c
            LEFT OUTER JOIN jobs j 
            ON c.company_id = j.company_id
            WHERE c.company_id = $1`;
        const queryParams = [id];
        const { rows } = await pool.query(SelectQuery, queryParams);
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        let CompanyData = {
            company_id: rows[0].company_id,
            employer_id: rows[0].employer_id,
            numberofemployees: rows[0].numberofemployees,
            company_name: rows[0].company_name,
            description: rows[0].description,
            website: rows[0].website,
            imageurl: rows[0].imageurl,
            registered_at: rows[0].registered_at
        }

        const jobData = await Promise.all(
            rows.filter(row => row.job_id != null).map(async row => {
                const jobApplicantsQuery = `
                        SELECT 
                            COUNT(*) AS applicant_count,
                            ARRAY_AGG(cv) AS cvs,
                            ARRAY_AGG(student_id) AS students
                            FROM jobapplications
                            WHERE job_id = $1;
                    `;
                const jobParams = [row.job_id];
                const { rows: applicantsRows } = await pool.query(jobApplicantsQuery, jobParams);

                const { applicant_count, cvs, students } = applicantsRows[0];

                return {
                    job_id: row.job_id,
                    title: row.title,
                    description: row.job_description,
                    requirement: row.requirement,
                    jobtype: row.jobtype,
                    posted_date: row.posted_date,
                    closing_date: row.closing_date,
                    status: row.status,
                    applicant_count: parseInt(applicant_count, 10),
                    students: students,
                    cvs: cvs || [],
                };
            })
        );
        await pool.query('COMMIT');

        return res.status(200).json({ company: CompanyData, jobs: jobData });
    } catch (e) {
        await pool.query('ROLLBACK');
        console.error("Error fetching single company data:", e);
        return res.status(500).json({ message: "Error fetching company data" });
    }
};


export const updateOneCompany = async (req, res) => {
    try {
        const { company_name, description, website, id, employer_id } = req.body;
        const imageUrl = req.file?.location || req.body.imageUrl || null;
        // console.log(req.body);

        if (!company_name || !description) {
            return res.status(400).json({
                message: "Company name or description missing",
            });
        }

        let selectQuery, selectQueryParams;
        selectQuery = 'select * from company where company_id=$1';
        selectQueryParams = [id];
        let { rows } = await pool.query(selectQuery, selectQueryParams);
        // console.log("rows", rows[0]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: "id not found",
                success: false
            })
        }

        let updateQuery = 'update company set company_name=$1,description=$2,website=$3,imageurl=$4 where company_id=$5  RETURNING *; '
        let updateParams = [company_name, description, website, imageUrl, id]
        const result = await pool.query(updateQuery, updateParams);
        if (result.rowCount === 0) {
            return res.status(400).json({
                message: "error updating company data",
                success: false
            })
        }
        // console.log("rows updated successfully", result.rowCount);
        return res.status(201).json({
            message: "Company updated successfully",
            data: result.rows[0]
        });
    } catch (e) {
        console.error("Error inserting company:", e);
        return res.status(500).json({
            message: "Error adding company",
            error: e.message,
        });
    }
}

export const getcompanybyuserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({
                message: "id is required",
                success: false,
            })
        }
        // if (role && role === 'student') {
        //     return res.status(403).json({
        //         message: "only employers can add company",
        //         success: false,
        //     })
        // }
        let findCompany = 'Select * from company where employer_id=$1';

        const { rows } = await pool.query(findCompany, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: 'employer has no Company registered',
                success: false
            })
        }
        // console.log(rows);
        return res.status(200).json({
            success: true,
            data: rows[0]
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }
}


export const getsearchedCompanies = async (req, res) => {
    try {
        const { query } = req.params;
        console.log("query,", query)
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query parameter is required",
            });
        }

        let companies;

        if (!isNaN(query)) {
            const topN = parseInt(query, 10); // Convert the query to a number
            const getTopCompaniesQuery = `
                SELECT * 
                FROM company
                LIMIT $1
            `;
            const { rows } = await pool.query(getTopCompaniesQuery, [topN]);
            companies = rows;
        } else {
            const searchQuery = `
                SELECT * 
                FROM company
                WHERE LOWER(company_name) LIKE $1
            `;
            const { rows } = await pool.query(searchQuery, [`%${query.toLowerCase()}%`]);
            companies = rows;
        }


        if (companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No companies found matching the criteria",
            });
        }

        return res.status(200).json({
            success: true,
            data: companies,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
