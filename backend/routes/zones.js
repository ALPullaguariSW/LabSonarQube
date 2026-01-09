import express from 'express';
import db from '../config/db.js';
import HTTP_STATUS from '../utils/httpStatus.js';

const zones = express.Router();

const ERROR_MSGS = {
  INVALID_ID: 'Invalid ID',
  INTERNAL_ERROR: 'Internal Server Error',
};

// GET all zones 
zones.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await db.query('SELECT * FROM zones WHERE name LIKE $1', [`%${search}%`]);
    return res.json(result.rows);
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

// GET one zone
zones.get('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    const result = await db.query('SELECT * FROM zones WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(ERROR_MSGS.INTERNAL_ERROR);
  }
});

zones.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.query('INSERT INTO zones (name, description) VALUES ($1, $2)', [name, description]);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Zone created',
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating zone',
    });
  }
});

// Similar para PUT y DELETE
zones.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    await db.query('UPDATE zones SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
    return res.json({
      success: true,
      message: 'Zone updated',
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating zone',
    });
  }
});

zones.delete('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send(ERROR_MSGS.INVALID_ID);
    }

    await db.query('DELETE FROM zones WHERE id = $1', [id]);
    return res.json({
      success: true,
      message: 'Zone deleted',
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting zone',
    });
  }
});

export default zones;