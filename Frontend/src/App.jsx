import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [items, setItems] = useState([]) // Estado para los items (nombre y descripción)
  const [newDescription, setNewDescription] = useState('') // Estado para la nueva descripción

  // Obtener los items desde el backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          'https://test-front-back-db.onrender.com/items'
        ) // Actualizado
        setItems(response.data)
      } catch (error) {
        console.error('Error al obtener los items', error)
      }
    }
    fetchItems()
  }, [])

  // Agregar un nuevo item
  const addItem = async () => {
    if (newDescription.trim() === '') return // Evitar agregar descripción vacía
    try {
      // Enviar solo la descripción; el nombre se genera en el backend
      const response = await axios.post(
        'https://test-front-back-db.onrender.com/items',
        {
          description: newDescription, // Se pasa solo la descripción
        }
      )
      setItems([...items, response.data]) // Agregar el nuevo item al estado
      setNewDescription('') // Limpiar el campo de descripción
    } catch (error) {
      console.error('Error al agregar el item', error)
    }
  }

  // Eliminar un item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://test-front-back-db.onrender.com/items/${id}`)
      setItems(items.filter((item) => item.id !== id)) // Eliminar el item del estado
    } catch (error) {
      console.error('Error al eliminar el item', error)
    }
  }

  return (
    <div style={styles.chatContainer}>
      <h1 style={styles.header}>Chat :D</h1>
      <div style={styles.itemsContainer}>
        {items.map((item) => (
          <div key={item.id} style={styles.item}>
            <strong>{item.name}</strong>: <span>{item.description}</span>
            <button
              onClick={() => deleteItem(item.id)}
              style={styles.deleteButton}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type='text'
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder='Escribe tu descripción...'
          style={styles.input}
        />
        <button onClick={addItem} style={styles.addButton}>
          ➕
        </button>
      </div>
    </div>
  )
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  itemsContainer: {
    flex: 1,
    overflowY: 'scroll',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    marginBottom: '8px',
    color: 'black',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
    fontSize: '18px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  input: {
    width: '80%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default App
