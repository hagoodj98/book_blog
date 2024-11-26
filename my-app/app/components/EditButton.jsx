
import React, { useState } from 'react'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function EditMe (props) {


    return (
        <div>
         
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Example textarea</Form.Label>
                        <Form.Control as="textarea"  value={props.note} rows={3} />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Update Note
                    </Button>
                    </Modal.Footer>
                </Modal>
            
        </div>
    )
    }

    export default EditMe;