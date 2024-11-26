import React, { useEffect, Fragment, useState } from "react";
import Button from '@mui/material/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from "axios";
import styles from '../styles/home.module.css';

function UpdateNote (props) {
    //console.log(props);

    const [show, setShow] = useState(false);
    const [prevNote, setNewNote] = useState(props.note)
    const handleClose = () => {
        setShow(false) 
        setNewNote(props.note);
    }
    
        const handleShow = () => setShow(true);
  
        const updateNoteAPI = async (id) => {
            //e.preventDefault();
            try {
                const body = { prevNote };
                console.log(body);
                const response= await axios({
                    method:'PATCH',
                    url: `http://localhost:4000/aboutentry/${id}`,
                    data : {
                        prevNote: body.prevNote,
                        id: id
                    }
                    });
    
                    window.location=`/`;
            } catch (error) {
                console.error(error.message);
            }
        }   
    

       return(
            <Fragment>
                <Button className={styles.edit} variant="primary" onClick={handleShow}>
                    <EditOutlinedIcon />
                </Button>
                <Modal  show={show} onHide={handleClose}>
                    <Modal.Header className={styles.modal} closeButton>
                    <Modal.Title className={styles.modaltitle}>Update Note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form >
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" value={prevNote} onChange={e => setNewNote(e.target.value)}  rows={3} />
                        </Form.Group>
                        <Button variant="outlined" type="submit" onClick={e => updateNoteAPI(props.id)}>Update</Button>
                    </Form>
                    </Modal.Body>
                </Modal>
            </Fragment>
       )       
}
export default UpdateNote;