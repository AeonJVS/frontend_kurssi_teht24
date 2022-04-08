import './App.css';
import React, { useState, useRef } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const App = () => {
  const [todo, setTodo] = useState({description: '', date: (new Date().toString().slice(0, 15)), priority:''});
  const [todos, setTodos] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [value, setValue] = useState('one');

  const gridRef = useRef();

  const columns = [
    { field: "description" , sortable: true , filter: true , floatingFilter: true },
    { field: "date" , sortable: true , filter: true , floatingFilter: true },
    { field: "priority" , sortable: true , filter: true, floatingFilter: true ,
      cellStyle: params => params.value === "High" ? {color: 'red'} : {color: 'black'} }
    ]

  const gridOptions = {
    animateRows: true
  }

  // 1) update shown date input, 2) convert chosen date to string 3) slice away unnecessary info 4) setTodo 
  const changeDate = (newDate) => {
    handleDateChange(newDate);
    let strDate = newDate.toString();
    strDate = strDate.slice(0, 15)
    setTodo({...todo, date: strDate});
  }

  const handleTabChange = (vent, value) => {
    setValue(value);
  }

  const inputChanged = (event) => {
    setTodo({...todo, [event.target.name]: event.target.value});
  }

  const addTodo = (event) => {
    setTodos([...todos, todo]);
  }

  const deleteTodo = () => {
    if (gridRef.current.getSelectedNodes().length > 0) {
      setTodos(todos.filter((todo, index) =>
        index !== gridRef.current.getSelectedNodes()[0].childIndex))
    } else {
      alert('Select row first');
    }
  }

  return (
    <div>
      <Tabs value={value} onChange={handleTabChange}>
        <Tab value="one" label="Home" />
        <Tab value="two" label="Todos" />
      </Tabs>

      {value === 'one' && <div>Welcome to the Todo App!</div>}
      {value === 'two' && 
      <div>
        <input type="text" onChange={inputChanged} placeholder="Description" name="description" value={todo.description}/>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={selectedDate} onChange={selectedDate => changeDate(selectedDate)} />
        </MuiPickersUtilsProvider>
        <input type="text" onChange={inputChanged} placeholder="Priority" name="priority" value={todo.priority}/>
        <button onClick={addTodo}>Add</button>
        <button onClick={deleteTodo}>Delete</button>

        <div className='ag-theme-material' style={{height: '700px', width: '70%', margin: 'auto'}} >
        <AgGridReact 
          animateRows={gridOptions}
          ref={gridRef}
          onGridReady={ params => gridRef.current = params.api }
          rowSelection='single'
          columnDefs={columns} 
          rowData={todos}>    
        </AgGridReact>
        </div>
        <table>
          <tbody>
          {
            todos.map((todo, index) => <tr key={index}><td>{todo.description}</td><td>{todo.date}</td><td>{todo.priority}</td></tr>)
          }
          </tbody>
        </table>
      </div>} 
    </div>
  );
};

export default App;