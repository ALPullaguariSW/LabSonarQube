import express from 'express';
import db from '../config/db.js';
import HTTP_STATUS from '../utils/httpStatus.js';

const spaces = express.Router();

const ERROR_MSGS = {
  INVALID_ID: 'Invalid ID',
  INTERNAL_ERROR: 'Internal Server Error',
};

// GET all spaces 
spaces.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await db.query('SELECT * FROM spaces WHERE number LIKE $1', [`%${search}%`]);
    return res.json(result.rows);
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

// GET one space
spaces.get('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    const result = await db.query('SELECT * FROM spaces WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

// POST create space
spaces.post('/', async (req, res) => {
  const { zone_id, number, status } = req.body;
  try {
    await db.query('INSERT INTO spaces (zone_id, number, status) VALUES ($1, $2, $3)', [zone_id, number, status]);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Space created',
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating space',
    });
  }
});

// PUT update space
spaces.put('/:id', async (req, res) => {
  const { zone_id, number, status } = req.body;
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    await db.query('UPDATE spaces SET zone_id = $1, number = $2, status = $3 WHERE id = $4', [zone_id, number, status, id]);
    return res.send('Space updated');
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

// DELETE space
spaces.delete('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    await db.query('DELETE FROM spaces WHERE id = $1', [id]);
    return res.send('Space deleted');
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

export default spaces;