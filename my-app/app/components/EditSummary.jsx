'use client';

import React, {useState, Fragment} from "react"
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import axios from "axios";
import styles from '../styles/home.module.css';

function EditSummary(props) {

    const [show, setShow] = useState(false);
    const [prevSummary, setNewSummary] = useState(props.entrySummary)
    const handleClose = () => {
        setShow(false) 
        setNewSummary(props.entrySummary);
    }
    
        const handleShow = () => setShow(true);
  
    //update summary
    const updateSummary = async e => {
        e.preventDefault();
        try {
            const body = { prevSummary };
            console.log(body);
            const response= await axios({
                method:'PATCH',
                url: `http://localhost:4000/entry/${props.id}`,
                data : {
                    prevSummary: body.prevSummary
                }
                });

                window.location="/";
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <Button className={styles.edit} variant="primary" onClick={handleShow}>
                <EditOutlinedIcon />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Summary</Form.Label>
                    <Form.Control as="textarea" value={prevSummary} onChange={e => setNewSummary(e.target.value)}  rows={3} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={e => updateSummary(e)}>
                        Update
                    </Button>
                </Form>
                </Modal.Body>
            </Modal>
        </Fragment>
        
    )
}

export default EditSummary;