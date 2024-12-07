const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'https://showycone.github.io',
    methods: 'GET,POST,PUT,DELETE',
  })
)

const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Rutas CRUD

// Obtener todos los items
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).json({ error: err })
    res.json(results)
  })
})

// Crear un nuevo item
app.post('/items', async (req, res) => {
  const { description } = req.body

  if (!description) {
    return res.status(400).json({ error: 'Description is required' })
  }

  try {
    // Verifica el valor de 'description'
    console.log('Received description:', description)

    // Obtener el último item para generar el nombre nuevo
    db.query(
      'SELECT * FROM items ORDER BY id DESC LIMIT 1',
      async (err, rows) => {
        if (err) {
          console.error('Error al obtener el último item:', err)
          return res
            .status(500)
            .json({ error: 'Error al obtener el último item' })
        }

        const newItemName =
          rows.length > 0 ? `Item ${rows[0].id + 1}` : 'Item 1'
        console.log('Generated name:', newItemName)

        // Insertar el nuevo item en la base de datos
        db.query(
          'INSERT INTO items (name, description) VALUES (?, ?)',
          [newItemName, description],
          (err, result) => {
            if (err) {
              console.error('Error al insertar el item:', err)
              return res.status(500).json({ error: 'Error al agregar el item' })
            }

            // Responder con el nuevo item
            const newItem = {
              id: result.insertId,
              name: newItemName,
              description,
            }
            res.status(201).json(newItem)
          }
        )
      }
    )
  } catch (error) {
    console.error('Error en el backend:', error)
    res.status(500).json({ error: 'Error al agregar el item' })
  }
})

// Actualizar un item
app.put('/items/:id', (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  db.query(
    'UPDATE items SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    (err) => {
      if (err) return res.status(500).json({ error: err })
      res.json({ message: 'Item actualizado' })
    }
  )
})

// Eliminar un item
app.delete('/items/:id', (req, res) => {
  const { id } = req.params
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err })
    res.json({ message: 'Item eliminado' })
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
