const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../config/database');

// @route   GET api/plan
// @desc    Get all plans for a user
// @access  Private
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM plans WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id], (err, plans) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Error del servidor' });
    }
    res.json(plans);
  });
});

// @route   GET api/plan/:id
// @desc    Get a specific plan with details
// @access  Private
router.get('/:id', auth, (req, res) => {
  const planId = req.params.id;

  // First check if the plan belongs to the user
  db.get('SELECT * FROM plans WHERE id = ? AND user_id = ?', [planId, req.user.id], (err, plan) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Error del servidor' });
    }

    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    // Get plan details
    db.get('SELECT * FROM plan_details WHERE plan_id = ?', [planId], (err, details) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Error del servidor' });
      }

      // Get fixed costs
      db.all('SELECT * FROM fixed_costs WHERE plan_id = ?', [planId], (err, fixedCosts) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ msg: 'Error del servidor' });
        }

        res.json({
          plan,
          details: details || {},
          fixedCosts: fixedCosts || []
        });
      });
    });
  });
});

// @route   POST api/plan
// @desc    Create a new plan
// @access  Private
router.post('/', auth, (req, res) => {
  const { name, description, details, fixedCosts } = req.body;

  db.serialize(() => {
    // Begin transaction
    db.run('BEGIN TRANSACTION');

    try {
      // Insert plan
      db.run(
        'INSERT INTO plans (user_id, name, description) VALUES (?, ?, ?)',
        [req.user.id, name, description],
        function(err) {
          if (err) {
            console.error(err.message);
            db.run('ROLLBACK');
            return res.status(500).json({ msg: 'Error al crear el plan' });
          }

          const planId = this.lastID;

          // Insert plan details
          const {
            inversion = 500000,
            cuota_mensual = 70,
            ingreso_pt = 0,
            cuota_inscripcion = 0,
            churn_rate = 5,
            coste_variable = 15,
            coste_llave = 0,
            tasa_morosos = 0,
            cac = 50
          } = details || {};

          db.run(
            `INSERT INTO plan_details 
            (plan_id, inversion, cuota_mensual, ingreso_pt, cuota_inscripcion, 
             churn_rate, coste_variable, coste_llave, tasa_morosos, cac) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [planId, inversion, cuota_mensual, ingreso_pt, cuota_inscripcion, 
             churn_rate, coste_variable, coste_llave, tasa_morosos, cac],
            (err) => {
              if (err) {
                console.error(err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ msg: 'Error al guardar los detalles del plan' });
              }

              // Insert fixed costs
              if (fixedCosts && fixedCosts.length > 0) {
                const stmt = db.prepare('INSERT INTO fixed_costs (plan_id, label, value) VALUES (?, ?, ?)');
                
                fixedCosts.forEach(cost => {
                  stmt.run(planId, cost.label, cost.value);
                });
                
                stmt.finalize();
              } else {
                // Insert default fixed costs
                const defaultCosts = [
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

                const stmt = db.prepare('INSERT INTO fixed_costs (plan_id, label, value) VALUES (?, ?, ?)');
                
                defaultCosts.forEach(cost => {
                  stmt.run(planId, cost.label, cost.value);
                });
                
                stmt.finalize();
              }

              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error(err.message);
                  db.run('ROLLBACK');
                  return res.status(500).json({ msg: 'Error al finalizar la transacción' });
                }

                res.json({ 
                  msg: 'Plan creado con éxito',
                  planId 
                });
              });
            }
          );
        }
      );
    } catch (err) {
      console.error(err.message);
      db.run('ROLLBACK');
      res.status(500).json({ msg: 'Error del servidor' });
    }
  });
});

// @route   PUT api/plan/:id
// @desc    Update a plan
// @access  Private
router.put('/:id', auth, (req, res) => {
  const planId = req.params.id;
  const { name, description, details, fixedCosts } = req.body;

  // First check if the plan belongs to the user
  db.get('SELECT * FROM plans WHERE id = ? AND user_id = ?', [planId, req.user.id], (err, plan) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Error del servidor' });
    }

    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    db.serialize(() => {
      // Begin transaction
      db.run('BEGIN TRANSACTION');

      try {
        // Update plan
        db.run(
          'UPDATE plans SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [name, description, planId],
          (err) => {
            if (err) {
              console.error(err.message);
              db.run('ROLLBACK');
              return res.status(500).json({ msg: 'Error al actualizar el plan' });
            }

            // Update plan details
            if (details) {
              db.run(
                `UPDATE plan_details SET 
                inversion = ?, cuota_mensual = ?, ingreso_pt = ?, cuota_inscripcion = ?,
                churn_rate = ?, coste_variable = ?, coste_llave = ?, tasa_morosos = ?, cac = ?
                WHERE plan_id = ?`,
                [
                  details.inversion, details.cuota_mensual, details.ingreso_pt, details.cuota_inscripcion,
                  details.churn_rate, details.coste_variable, details.coste_llave, details.tasa_morosos, details.cac,
                  planId
                ],
                (err) => {
                  if (err) {
                    console.error(err.message);
                    db.run('ROLLBACK');
                    return res.status(500).json({ msg: 'Error al actualizar los detalles del plan' });
                  }

                  // Update fixed costs
                  if (fixedCosts && fixedCosts.length > 0) {
                    // Delete existing fixed costs
                    db.run('DELETE FROM fixed_costs WHERE plan_id = ?', [planId], (err) => {
                      if (err) {
                        console.error(err.message);
                        db.run('ROLLBACK');
                        return res.status(500).json({ msg: 'Error al actualizar los costes fijos' });
                      }

                      // Insert new fixed costs
                      const stmt = db.prepare('INSERT INTO fixed_costs (plan_id, label, value) VALUES (?, ?, ?)');
                      
                      fixedCosts.forEach(cost => {
                        stmt.run(planId, cost.label, cost.value);
                      });
                      
                      stmt.finalize();

                      // Commit transaction
                      db.run('COMMIT', (err) => {
                        if (err) {
                          console.error(err.message);
                          db.run('ROLLBACK');
                          return res.status(500).json({ msg: 'Error al finalizar la transacción' });
                        }

                        res.json({ msg: 'Plan actualizado con éxito' });
                      });
                    });
                  } else {
                    // Commit transaction
                    db.run('COMMIT', (err) => {
                      if (err) {
                        console.error(err.message);
                        db.run('ROLLBACK');
                        return res.status(500).json({ msg: 'Error al finalizar la transacción' });
                      }

                      res.json({ msg: 'Plan actualizado con éxito' });
                    });
                  }
                }
              );
            } else {
              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error(err.message);
                  db.run('ROLLBACK');
                  return res.status(500).json({ msg: 'Error al finalizar la transacción' });
                }

                res.json({ msg: 'Plan actualizado con éxito' });
              });
            }
          }
        );
      } catch (err) {
        console.error(err.message);
        db.run('ROLLBACK');
        res.status(500).json({ msg: 'Error del servidor' });
      }
    });
  });
});

// @route   DELETE api/plan/:id
// @desc    Delete a plan
// @access  Private
router.delete('/:id', auth, (req, res) => {
  const planId = req.params.id;

  // First check if the plan belongs to the user
  db.get('SELECT * FROM plans WHERE id = ? AND user_id = ?', [planId, req.user.id], (err, plan) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Error del servidor' });
    }

    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    db.serialize(() => {
      // Begin transaction
      db.run('BEGIN TRANSACTION');

      try {
        // Delete fixed costs
        db.run('DELETE FROM fixed_costs WHERE plan_id = ?', [planId], (err) => {
          if (err) {
            console.error(err.message);
            db.run('ROLLBACK');
            return res.status(500).json({ msg: 'Error al eliminar los costes fijos' });
          }

          // Delete plan details
          db.run('DELETE FROM plan_details WHERE plan_id = ?', [planId], (err) => {
            if (err) {
              console.error(err.message);
              db.run('ROLLBACK');
              return res.status(500).json({ msg: 'Error al eliminar los detalles del plan' });
            }

            // Delete plan
            db.run('DELETE FROM plans WHERE id = ?', [planId], (err) => {
              if (err) {
                console.error(err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ msg: 'Error al eliminar el plan' });
              }

              // Commit transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error(err.message);
                  db.run('ROLLBACK');
                  return res.status(500).json({ msg: 'Error al finalizar la transacción' });
                }

                res.json({ msg: 'Plan eliminado con éxito' });
              });
            });
          });
        });
      } catch (err) {
        console.error(err.message);
        db.run('ROLLBACK');
        res.status(500).json({ msg: 'Error del servidor' });
      }
    });
  });
});

module.exports = router;
