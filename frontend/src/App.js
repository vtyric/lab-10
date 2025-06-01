import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, TextField, Button,
    List, ListItem, ListItemText, IconButton, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';

const App = () => {
    const [todoItems, setTodoItems] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/todoitems/');
            setTodoItems(response.data);
        } catch (error) {
            console.error('There was an error fetching the todo items!', error);
        }
    };

    const addTodoItem = async () => {
        const newItem = {title: newTitle, description: newDescription};
        try {
            const response = await axios.post('http://127.0.0.1:8000/todoitems/', newItem);
            setTodoItems([...todoItems, response.data]);
            setNewTitle('');
            setNewDescription('');
        } catch (error) {
            console.error('There was an error creating the todo item!', error);
        }
    };

    const updateTodoItem = async (id) => {
        const updatedItem = {title: editTitle, description: editDescription};
        try {
            const response = await axios.put(`http://127.0.0.1:8000/todoitems/${id}`, updatedItem);
            setTodoItems(todoItems.map(item => (item.id === id ? response.data : item)));
            setEditItem(null);
        } catch (error) {
            console.error('There was an error updating the todo item!', error);
        }
    };

    const deleteTodoItem = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/todoitems/${id}`);
            setTodoItems(todoItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('There was an error deleting the todo item!', error);
        }
    };

    const openEditDialog = (item) => {
        setEditItem(item);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const closeEditDialog = () => {
        setEditItem(null);
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">ToDo List</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Typography variant="h4" style={{marginTop: '20px'}}>Create a new task</Typography>
                <TextField
                    label="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={addTodoItem} style={{marginTop: '10px'}}>
                    Add
                </Button>
                <Typography variant="h4" style={{marginTop: '40px'}}>Tasks</Typography>
                <List>
                    {todoItems.map((item) => (
                        <ListItem key={item.id} style={{borderBottom: '1px solid #ddd'}}>
                            <ListItemText primary={item.title} secondary={item.description}/>
                            <IconButton edge="end" onClick={() => openEditDialog(item)}>
                                <Edit/>
                            </IconButton>
                            <IconButton edge="end" onClick={() => deleteTodoItem(item.id)}>
                                <Delete/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Dialog open={Boolean(editItem)} onClose={closeEditDialog}>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Edit the title and description of the task.</DialogContentText>
                        <TextField
                            label="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEditDialog} color="primary">Cancel</Button>
                        <Button onClick={() => updateTodoItem(editItem.id)} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default App;
