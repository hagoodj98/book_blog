'use-client';

import React, {useEffect, useState} from "react"
import { useParams } from "next/navigation";
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useRouter } from 'next/navigation'
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Input from "./Input";
import AddIcon from '@mui/icons-material/Add';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from '../styles/home.module.css'


function NoteField(props) {
    const router = useRouter();
   //console.log(props);
   // console.log(props.currentid + "to be deleted");
    const [note, setNote] = useState("");

    const addNoteAPI = async e => {
        setNote("")
        e.preventDefault();
       // props.onclick(newNote)
        try {
            const result =  await axios({
                method: 'POST',
                url: `http://localhost:4000/aboutentry/${props.id}`,
                data: {
                    newNote: note,
                    id: props.id,
                }
              });
             
             // router.push(`entry/${props.id}`);
            } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div>
             <form onSubmit={addNoteAPI }>
                <div className="d-flex gap-3 p-3">
                    <TextField fullWidth label="add note" id="fullWidth" required  type="text"  value={note} onChange={e => setNote(e.target.value)} />
                    <Fab color="primary" className={styles.addnote}  type="submit"  aria-label="add">
                        <AddIcon />
                    </Fab>
                </div>
              
            </form>
        </div>
    )

}

export default NoteField;


