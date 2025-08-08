const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../config/database-pg');

// @route   GET api/plan
// @desc    Get all plans for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get plans error:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   GET api/plan/:id
// @desc    Get a specific plan with details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  const planId = req.params.id;

  try {
    // First check if the plan belongs to the user
    const planResult = await pool.query(
      'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
      [planId, req.user.id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    const plan = planResult.rows[0];

    // Get plan details
    const detailsResult = await pool.query(
      'SELECT * FROM plan_details WHERE plan_id = $1',
      [planId]
    );

    // Get fixed costs
    const fixedCostsResult = await pool.query(
      'SELECT * FROM fixed_costs WHERE plan_id = $1',
      [planId]
    );

    // Transform fixed costs to match frontend format
    const fixedCosts = fixedCostsResult.rows.map(cost => ({
      id: `cost_${cost.id}`,
      label: cost.label,
      value: parseFloat(cost.value)
    }));

    // Transform details to match frontend format
    const details = detailsResult.rows[0] || {};
    const inputs = {
      inversion: parseFloat(details.inversion) || 500000,
      cuotaMensual: parseFloat(details.cuota_mensual) || 70,
      ingresoPT: parseFloat(details.ingreso_pt) || 0,
      cuotaInscripcion: parseFloat(details.cuota_inscripcion) || 0,
      churnRate: parseFloat(details.churn_rate) || 5,
      costeVariable: parseFloat(details.coste_variable) || 15,
      costeLlave: parseFloat(details.coste_llave) || 0,
      tasaMorosos: parseFloat(details.tasa_morosos) || 0,
      cac: parseFloat(details.cac) || 50
    };

    res.json({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      inputs,
      fixed_costs: fixedCosts,
      created_at: plan.created_at,
      updated_at: plan.updated_at
    });

  } catch (err) {
    console.error('Get plan error:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   POST api/plan
// @desc    Create a new plan
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, inputs, fixed_costs } = req.body;

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Insert plan
    const planResult = await client.query(
      'INSERT INTO plans (user_id, name, description) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, name, description]
    );

    const planId = planResult.rows[0].id;

    // Insert plan details
    const {
      inversion = 500000,
      cuotaMensual = 70,
      ingresoPT = 0,
      cuotaInscripcion = 0,
      churnRate = 5,
      costeVariable = 15,
      costeLlave = 0,
      tasaMorosos = 0,
      cac = 50
    } = inputs || {};

    await client.query(
      `INSERT INTO plan_details 
      (plan_id, inversion, cuota_mensual, ingreso_pt, cuota_inscripcion, 
       churn_rate, coste_variable, coste_llave, tasa_morosos, cac) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [planId, inversion, cuotaMensual, ingresoPT, cuotaInscripcion, 
       churnRate, costeVariable, costeLlave, tasaMorosos, cac]
    );

    // Insert fixed costs
    const costsToInsert = fixed_costs && fixed_costs.length > 0 ? fixed_costs : [
      { label: 'Alquiler del Local', value: 5000 },
      { label: 'Leasing Material Fitness', value: 0 },
      { label: 'Salarios Inc. SS.SS', value: 13750 },
      { label: 'Suministros (Luz, Agua, Net)', value: 2000 },
      { label: 'Seguros (Insurance)', value: 300 },
      { label: 'Gastos de Gestoría', value: 0 },
      { label: 'Mantenimiento', value: 500 },
      { label: 'Licencias (SGAE, Les Mills, etc.)', value: 750 },
      { label: 'Marketing Fijo y Branding', value: 1000 },
      { label: 'Otros Costes Operativos / Admón.', value: 1700 },
      { label: 'Cuota Préstamo Financiación', value: 0 }
    ];

    for (const cost of costsToInsert) {
      await client.query(
        'INSERT INTO fixed_costs (plan_id, label, value) VALUES ($1, $2, $3)',
        [planId, cost.label, cost.value]
      );
    }

    await client.query('COMMIT');

    res.json({ 
      msg: 'Plan creado con éxito',
      planId 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create plan error:', err.message);
    res.status(500).json({ msg: 'Error al crear el plan' });
  } finally {
    client.release();
  }
});

// @route   PUT api/plan/:id
// @desc    Update a plan
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const planId = req.params.id;
  const { name, description, inputs, fixed_costs } = req.body;

  const client = await pool.connect();
  
  try {
    // First check if the plan belongs to the user
    const planCheck = await client.query(
      'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
      [planId, req.user.id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    await client.query('BEGIN');

    // Update plan
    await client.query(
      'UPDATE plans SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, description, planId]
    );

    // Update plan details
    if (inputs) {
      await client.query(
        `UPDATE plan_details SET 
        inversion = $1, cuota_mensual = $2, ingreso_pt = $3, cuota_inscripcion = $4,
        churn_rate = $5, coste_variable = $6, coste_llave = $7, tasa_morosos = $8, cac = $9
        WHERE plan_id = $10`,
        [
          inputs.inversion, inputs.cuotaMensual, inputs.ingresoPT, inputs.cuotaInscripcion,
          inputs.churnRate, inputs.costeVariable, inputs.costeLlave, inputs.tasaMorosos, inputs.cac,
          planId
        ]
      );
    }

    // Update fixed costs
    if (fixed_costs && fixed_costs.length > 0) {
      // Delete existing fixed costs
      await client.query('DELETE FROM fixed_costs WHERE plan_id = $1', [planId]);

      // Insert new fixed costs
      for (const cost of fixed_costs) {
        await client.query(
          'INSERT INTO fixed_costs (plan_id, label, value) VALUES ($1, $2, $3)',
          [planId, cost.label, cost.value]
        );
      }
    }

    await client.query('COMMIT');

    res.json({ msg: 'Plan actualizado con éxito' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update plan error:', err.message);
    res.status(500).json({ msg: 'Error al actualizar el plan' });
  } finally {
    client.release();
  }
});

// @route   DELETE api/plan/:id
// @desc    Delete a plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const planId = req.params.id;

  const client = await pool.connect();
  
  try {
    // First check if the plan belongs to the user
    const planCheck = await client.query(
      'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
      [planId, req.user.id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    await client.query('BEGIN');

    // Delete fixed costs (cascade should handle this, but being explicit)
    await client.query('DELETE FROM fixed_costs WHERE plan_id = $1', [planId]);

    // Delete plan details
    await client.query('DELETE FROM plan_details WHERE plan_id = $1', [planId]);

    // Delete plan
    await client.query('DELETE FROM plans WHERE id = $1', [planId]);

    await client.query('COMMIT');

    res.json({ msg: 'Plan eliminado con éxito' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete plan error:', err.message);
    res.status(500).json({ msg: 'Error al eliminar el plan' });
  } finally {
    client.release();
  }
});

module.exports = router;