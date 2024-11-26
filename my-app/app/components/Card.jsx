"use-client";

import React, {useState} from "react";
import Row from 'react-bootstrap/Row';
import DeleteIcon from '@mui/icons-material/Delete';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Card(props) {
    const [show, setShow] = useState(false);
    const [prevSummary, setNewSummary] = useState(props.summary)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //console.log(props);

    const deleteEntryAPI = async (event) => {
        event.preventDefault();
        try {
            const response = await axios({
                method:'post',
                url: 'http://localhost:4000/delete',
                data: {
                    id: props.entry_id
                },
                });
         
        } catch (error) {
          console.log(error);
          
        }
      }
    const updateSummaryAPI = async (e) => {
      
        const body = prevSummary;

       // console.log(body);
        try {
            const response = await axios({
                method:'post',
                url: 'http://localhost:4000/updatesummary',
                data: {
                    id: props.entry_id,
                    updateSummary: body
                },
            });
           
        } catch (error) {
            
        }
    }
    return (
        <div>
            <Row>
                <Col>
                <img src={props.large_sized_image} class="img-fluid"  alt="Cover Not found"></img>
                <p>{props.rating}</p>
            <p class="work-sans"> <sup>/ 5 <sup><StarIcon /></sup></sup></p>
                </Col>
                <Col>
                <Form onClick={ () => deleteEntryAPI()}>
                    <button type="submit" >
                        <DeleteIcon />
                    </button>
                </Form>
                
                <h3 >{props.title}| {props.author}</h3>
                <p>{props.summary}<Button variant="primary" onClick={handleShow}>
               <ModeEditIcon />
                </Button> </p>
                
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={e => updateSummaryAPI(e)}>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Example textarea</Form.Label>
                        <Form.Control as="textarea" value={prevSummary} onChange={e => setNewSummary(e.target.value)} rows={3} />
                        </Form.Group>
                        <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Update Summary
                    </Button>
                    </Form>
                    </Modal.Body>
                </Modal>
                
                 <Link href={{
                    pathname: '/users/about',
                    query: {
                        author: props.author,
                        entry_created: props.created,
                        id: props.entry_id,
                        imagelarge: props.large_sized_image,
                        isbn: props.isbn,
                        publishdate: props.publish_date,
                        rating_avg: props.rating,
                        rating_cnt: props.count,
                        subjects: props.subjects,
                        subtitle: props.subtitle,
                        summary: props.summary,
                        title: props.title,
                    }

                 }}><Button  variant="outlined">Primary</Button></Link>
               
                </Col>
            <div>
                
            </div>
            
             </Row>
             
        </div>
        
    )
}

export default Card;