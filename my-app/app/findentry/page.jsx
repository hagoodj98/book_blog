'use client';

import React, {useState} from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/navigation'
import styles from '../styles/home.module.css'
import TextField from '@mui/material/TextField';
import Footer from '../components/footer';
import { Work_Sans, Anton } from "next/font/google";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormHelperText from '@mui/material/FormHelperText';

const antonSC = Anton({
subsets: ['latin'],
display: 'swap',
weight: '400',

})
const worksans =  Work_Sans({
  subsets:['latin'],
  display: 'swap',
})



export default function TextControlsExample() {
  let openBook = 'https://openlibrary.org/';
    const router = useRouter();
    const [bookInfo, setBookInfo] = useState({
        isbn: "",
        summary: "",
    });
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
   
    const onSubmitForm  = async event => {
        event.preventDefault();
        try {
            const body = bookInfo;
            const response = await axios({
            method:'post',
            url: 'http://localhost:4000/newentry',
            data: {
                isbn: body.isbn,
                summary: body.summary
            },
            //headers: {"Content-Type": "application/json"},
            });
            console.log(response);
            if (response.data === "Entry does not exist, try again") {
              setError(response.data);
              router.push("/findentry");
              
              toast.error('Entry does not exist! Verify you have the correct one.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              
            }
             else if (response.data === "Entry already exists, try again") {
              setError(response.data);
              router.push("/findentry");

              toast.error('Entry already exists! Enter in a new ISBN.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            }
            else {
              router.push('../');
              toast.success('Entry added!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            }
            //console.log(response);
        } catch (err) {
            console.error(err);
        }
      }
    function handleChange(event) {
        const { name, value } = event.target;
        
        if(event.target.value.length < 10) {
          setIsDisabled(true);
          setError("Minium of 10 characters");
        }
        else{
          setIsDisabled(false);
         
        }
        

        setBookInfo((prevBook) => {
          return {
            ...prevBook,
            [name]: value,
          };
        });
        return bookInfo;
      }

    return (
      <main>
        <div className='container d-flex flex-column'>
          <div className={styles.findentrybuttoncontainer}>
            <div className={styles.entrybuttonexit}>
              <Button href='../' variant="outlined">Back To Blog</Button>
            </div>
          </div>
          
          <div className={styles.addentry}>
            <div className={styles.form}>
            <h2 className='m-2'><span className={antonSC.className}>Find Book</span></h2>
            <p className='pb-3'>*Minimum 10 Characters for each field*</p>
            <div className={styles.d}>
              <Form onSubmit={onSubmitForm}>
                <Form.Group  controlId="exampleForm.ControlInput1">
                  {error === "Entry already exists, try again" ?  <TextField name="isbn" error onChange={handleChange}  fullWidth helperText={error} value={bookInfo.isbn} required   id="fullWidth" label="Error" variant="outlined" />
                    : 
                    error === "Entry does not exist, try again" ? <TextField error  name="isbn" id="outlined-error-helper-text" fullWidth  onChange={handleChange} value={bookInfo.isbn} required label="Error"  helperText={error}/> 
                    : 
                    <TextField name="isbn" onChange={handleChange} value={bookInfo.isbn} required  fullWidth  id="fullWidth" label="Enter the ISBN 10 or 13" variant="outlined" />
                  }
                </Form.Group>
                <br />
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control as={"textarea"} multiline name="summary" required  onChange={handleChange}  placeholder='Enter Summary...' value={bookInfo.summary}  rows={3} />
                </Form.Group>
                <div className='d-flex justify-center'>
                  <Button className={worksans.className} disabled={isDisabled} type='submit' variant="outlined">Add Entry</Button>
                </div>
              </Form>
            </div>
            </div>
             
            </div>
        </div>
        <Footer />
      </main>
    );
  }
  // <TextField error id="outlined-error-helper-text" label="Error" defaultValue="Hello World" helperText="Entry does not exist."/>
//  <TextField error id="outlined-error-helper-text" label="Error" defaultValue="Hello World" helperText="Entry already exist."/>

     