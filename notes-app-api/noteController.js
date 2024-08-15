const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client')
const { validationResult } = require("express-validator")
const prisma = new PrismaClient()

function date() {
    const date = new Date()
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '-')
    return formattedDate
}

async function get (req, res) {
    const notes = await prisma.note.findMany()
    res.status(200).json({
        success: true,
        message: "Get data successfully",
        data: notes,
    })
}

async function show (req, res) {
    const notes = await prisma.note.findUnique({
        where: {id: req.params.id}
    })

    if (notes == null) {
        return res.status(400).json({
            success: false,
            error_code: 400,
            message: "Record not found",
        })
    }

    res.status(200).json({
        success: true,
        message: "Get data successfully",
        data: notes,
    })
}

async function create (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            error_code: 400,
            errors: errors.errors[0] 
        });
    }

    const data = req.body
    data.id = uuidv4()
    data.createdat = date()
    
    try {
        const notes = await prisma.note.create({
            data: data,
        })
        res.status(200).json({
            success: true,
            message: 'Create note successfully',
            data: notes
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            error_code: 500,
            message: error.meta.cause,
        })
    }
}

async function update (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            error_code: 400,
            errors: errors.errors[0] 
        });
    }

    try {
        const notes = await prisma.note.update({
            where: {id: req.params.id},
            data: req.body,
        })
        res.status(200).json({
            success: true,
            message: 'Update note successfully',
            data: notes
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            error_code: 500,
            message: error.meta.cause,
        })
    }
}

async function remove (req, res) {
    try {
        const notes = await prisma.note.delete({
            where: {id: req.params.id},
        })
        res.status(200).json({
            success: true,
            message: 'Delete note successfully',
            data: notes
        })
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            error_code: 500,
            message: error.meta.cause,
        })
    }
}

module.exports = {get, show, create, update, remove}